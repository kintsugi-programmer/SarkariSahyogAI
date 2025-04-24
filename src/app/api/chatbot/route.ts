import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import connectToDatabase from '@/lib/mongoose';
import Scheme from '@/models/Scheme';

const apiKey = process.env.GEMINI_API_KEY;
const model = 'gemini-2.0-flash';

const getTextFromResponse = (result: any): string =>
  result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
  }

  if (!message || message.trim() === '') {
    return NextResponse.json({
      answer:
        '👋 Welcome to Sarkari Sahayog AI! Please tell me about yourself (e.g. age, gender, caste, location, employment, disability, etc.), and I’ll find relevant government schemes for you.'
    });
  }

  await connectToDatabase();
  const ai = new GoogleGenAI({ apiKey });

  const extractionPrompt = `
You are an AI assistant. Given a natural language input, extract a structured profile.

Return a JSON object with the following fields:
- age (number)
- gender (male, female, transgender, null)
- employment_status (student, employed, unemployed, retired, self-employed, etc.)
- location (Indian state or UT)
- caste (SC, ST, OBC, General)
- disability_status (yes or no)
- minority_status (yes or no)
- bpl_status (yes or no)
- residence (urban or rural)

If any field is missing, set it to null. Only return JSON — no markdown, no explanation.

Input: "${message}"
`;

  try {
    const extractResult = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: extractionPrompt }] }],
    });

    let raw = getTextFromResponse(extractResult).replace(/```json|```/g, '').trim();

    let profile: any = {};
    try {
      profile = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Could not parse Gemini profile output' }, { status: 400 });
    }

    const filters: any[] = [];

    if (profile.gender)
      filters.push({ $or: [{ eligible_gender: profile.gender }, { eligible_gender: 'all' }] });

    if (profile.caste)
      filters.push({ $or: [{ eligible_caste: profile.caste }, { eligible_caste: 'all' }] });

    if (profile.residence)
      filters.push({ $or: [{ eligible_residence: profile.residence }, { eligible_residence: 'both' }] });

    if (profile.minority_status)
      filters.push({ $or: [{ is_minority_eligible: profile.minority_status }, { is_minority_eligible: 'no' }] });

    if (profile.disability_status)
      filters.push({ $or: [{ is_differently_abled_eligible: profile.disability_status }, { is_differently_abled_eligible: 'no' }] });

    if (profile.bpl_status)
      filters.push({ $or: [{ is_below_poverty_line: profile.bpl_status }, { is_below_poverty_line: 'no' }] });

    if (profile.employment_status)
      filters.push({ $or: [{ employment_status: profile.employment_status }, { employment_status: 'all' }] });

    if (profile.location)
      filters.push({ eligible_state: profile.location });

    if (profile.age && typeof profile.age === 'number') {
      const ageRanges = [
        '0-10', '11-20', '21-30', '31-40', '41-50',
        '51-60', '61-70', '71-80', '81-90', '91-100', '100+'
      ];
      const ageRange = ageRanges.find(range => {
        const [min, max] = range.includes('+')
          ? [parseInt(range), Infinity]
          : range.split('-').map(Number);
        return profile.age >= min && profile.age <= max;
      });
      if (ageRange) filters.push({ eligible_age_range: ageRange });
    }

    const query = filters.length > 0 ? { $and: filters } : {};

    const schemes = await Scheme.find(query).limit(5).lean(); // Use .lean() for faster reads

    if (!schemes.length) {
      return NextResponse.json({ answer: 'No schemes found for your profile.' });
    }

    const formatted = schemes.map(s => `
• ${s.scheme_name}<br>
  ↳ Link: <a href="${s.link_to_apply}" target="_blank" rel="noopener noreferrer">Apply Here</a><br>
  ↳ Benefits: ${s.benefits ? s.benefits.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>') : 'No details'}<br>
  ↳ Eligibility: ${s.eligibility_criteria || 'Not specified'}<br>
  ↳ Category: ${s.category}<br>
  ↳ Application Mode: ${s.application_mode || 'N/A'}<br>
  ↳ Status: ${s.scheme_status || 'open'}
`).join('<br><br>');

    return new NextResponse(JSON.stringify({
      answer: `Here are some schemes you may be eligible for:<br><br>${formatted}`,
      profile,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error('Gemini/MongoDB Error:', error.message || error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}