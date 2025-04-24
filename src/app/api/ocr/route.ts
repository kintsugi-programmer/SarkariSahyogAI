// src/app/api/ocr/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content } from '@google/generative-ai';
import connectToDatabase from '@/lib/mongoose'; // Adjust path if needed
import Scheme from '@/models/Scheme'; // Adjust path if needed - AND MAKE SURE IT HAS THE CORRECT ENUMS/FIELDS

const apiKey = process.env.GEMINI_API_KEY;
const modelName = 'gemini-1.5-flash-latest'; // Or 'gemini-1.5-pro-latest', 'gemini-pro-vision'

function arrayBufferToGenerativePart(buffer: ArrayBuffer, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(buffer).toString('base64'),
      mimeType,
    },
  };
}

// --- Main API Route Handler ---
export async function POST(req: Request) {
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY environment variable.');
    return NextResponse.json(
      { error: 'Server configuration error: Missing API Key' },
      { status: 500 }
    );
  }

  try {
    const form = await req.formData();
    const frontBlob = form.get('front_image') as Blob | null;
    const backBlob = form.get('back_image') as Blob | null;

    if (!frontBlob || !backBlob) {
      return NextResponse.json(
        { error: 'Both front_image and back_image are required' },
        { status: 400 }
      );
    }

    // --- Image Processing ---
    const frontBuffer = await frontBlob.arrayBuffer();
    const backBuffer = await backBlob.arrayBuffer();
    const frontMimeType = frontBlob.type && frontBlob.type !== 'application/octet-stream' ? frontBlob.type : 'image/jpeg';
    const backMimeType = backBlob.type && backBlob.type !== 'application/octet-stream' ? backBlob.type : 'image/jpeg';
    const frontPart = arrayBufferToGenerativePart(frontBuffer, frontMimeType);
    const backPart = arrayBufferToGenerativePart(backBuffer, backMimeType);

    // --- Gemini API Interaction ---
    const ocrPrompt = `
You are an expert OCR AI specialized in Indian Aadhaar cards.
Analyze the following two images, representing the front and back of an Aadhaar card.
Extract the following details accurately:
- name (string): The full name exactly as printed.
- age (number): Calculate the current age based on the Date of Birth (DOB). If only Year of Birth (YOB) is present, estimate age based on YOB. If neither is clearly visible, return null.
- gender (string): "Male", "Female", or "Transgender".
- residence (string): Determine if the address indicates "urban" or "rural". If unclear, return null.
- caste (string): This information is *not* printed on Aadhaar cards. Return null for this field.
- location (string): Extract the Indian state name from the address (e.g., "Uttar Pradesh", "Tamil Nadu"). Return null if not found.

Return ONLY a single, valid JSON object containing these keys. Use null for any field that cannot be reliably extracted. Do not include any introductory text, markdown formatting (like \`\`\`json), or explanations outside the JSON structure itself.

Example of expected output:
{
  "name": "PRIYA SHARMA",
  "age": 28,
  "gender": "Female",
  "residence": "urban",
  "caste": null,
  "location": "Delhi"
}
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    const generationConfig = { temperature: 0.2, topK: 1, topP: 0.95, maxOutputTokens: 1024 };
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
    const contents: Content[] = [{ role: 'user', parts: [{ text: ocrPrompt }, frontPart, backPart] }];

    console.log(`Sending request to Gemini model: ${modelName}`);
    const result = await model.generateContent({ contents, generationConfig, safetySettings });

    // --- Process Gemini Response ---
    const response = result.response;
    const rawText = response.text();
    console.log('Raw text response from Gemini:', rawText);

    if (!rawText) {
      const blockReason = response.promptFeedback?.blockReason;
      const safetyRatings = response.candidates?.[0]?.safetyRatings;
      console.error('Gemini response was empty or blocked.', { blockReason, safetyRatings });
      return NextResponse.json(
        { error: 'AI failed to generate response.', blockReason, safetyRatings },
        { status: 500 }
      );
    }

    // ** Robust JSON Extraction **
    // Use regex to find the first '{' and the last '}' and capture everything in between
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Could not find valid JSON block ({...}) within the raw response.");
      console.error("Raw text was:", rawText);
      return NextResponse.json(
        { error: 'AI response did not contain a recognizable JSON object.', raw_response: rawText },
        { status: 500 }
      );
    }

    const jsonString = jsonMatch[0]; // The extracted JSON block
    console.log('Extracted JSON string BEFORE parsing:', JSON.stringify(jsonString));

    let profile: any;
    try {
      profile = JSON.parse(jsonString); // Parse the extracted block

      if (typeof profile !== 'object' || profile === null || !profile.hasOwnProperty('name')) {
        throw new Error("Parsed response is not a valid profile object or missing required fields.");
      }
      console.log('Parsed Profile:', profile);
    } catch (parseError: any) {
      console.error('Failed to parse extracted JSON string:', parseError);
      console.error('String that failed parsing:', JSON.stringify(jsonString));
      return NextResponse.json(
        { error: 'Could not process the extracted information format.', raw_response: jsonString },
        { status: 500 }
      );
    }

    // --- Database Interaction ---
    await connectToDatabase();

    const filters: any[] = [];

    // Match profile data to Scheme.ts fields and enums
    // Gender check (ensure case matches enum if needed, or use regex)
    if (profile.gender && ['Male', 'Female', 'Transgender'].includes(profile.gender)) {
      const genderLower = profile.gender.toLowerCase(); // Match schema enum 'female', 'male', 'transgender'
      filters.push({ $or: [{ eligible_gender: genderLower }, { eligible_gender: 'all' }] });
    } else {
        filters.push({ eligible_gender: 'all' }); // Default to all if not specified/invalid
    }

    // Caste check (usually null from OCR, but handle if present)
    if (profile.caste && ['SC', 'ST', 'OBC', 'PVTG', 'General'].includes(profile.caste)) {
        const casteLower = profile.caste.toLowerCase(); // Match schema enum 'sc', 'st', etc. if they are lowercase
        // Assuming schema enum uses 'SC', 'ST', etc. as provided:
        filters.push({ $or: [{ eligible_caste: profile.caste }, { eligible_caste: 'all' }] });
    } else {
        filters.push({ eligible_caste: 'all' }); // Default
    }

    // Residence check
    if (profile.residence && ['urban', 'rural'].includes(profile.residence)) {
      filters.push({ $or: [{ eligible_residence: profile.residence }, { eligible_residence: 'both' }] });
    } else {
        filters.push({ eligible_residence: 'both' }); // Default
    }

    // Location check - requires exact match with state names in the enum
    if (profile.location && typeof profile.location === 'string') {
      // Ensure the extracted location is one of the valid enum values in Scheme.ts
      const validStates = [ // Copy exact states from your Scheme.ts enum
        'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
        'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
        'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
        'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
        'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
        'The Dadra And Nagar Haveli And Daman And Diu', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
        'West Bengal',
      ];
      if (validStates.includes(profile.location)) {
         filters.push({ $or: [{ eligible_state: profile.location }, { eligible_state: 'All' }] });
      } else {
          console.warn(`Extracted location "${profile.location}" not in valid state enum. Querying for 'All' states.`);
          filters.push({ eligible_state: 'All' });
      }
    } else {
        filters.push({ eligible_state: 'All' }); // Default
    }

    // ** Corrected Age Range Logic **
    if (typeof profile.age === 'number' && profile.age >= 0) {
        const ageRanges = [ // Must match the enum strings in Scheme.ts!
            '0-10', '11-20', '21-30', '31-40', '41-50', '51-60',
            '61-70', '71-80', '81-90', '91-100', '100+'
        ];
        let targetAgeRange: string | undefined; // Don't default to 'All' here

        for (const range of ageRanges) {
            if (range === '100+') {
                if (profile.age >= 100) {
                    targetAgeRange = range;
                    break;
                }
            } else {
                const [minStr, maxStr] = range.split('-');
                const min = parseInt(minStr, 10);
                const max = parseInt(maxStr, 10);
                if (!isNaN(min) && !isNaN(max) && profile.age >= min && profile.age <= max) {
                    targetAgeRange = range;
                    break;
                }
            }
        }

        console.log(`Mapping profile age ${profile.age} to schema range: ${targetAgeRange || "'All' (no specific match)"}`);
        if (targetAgeRange) {
             // Query schemes matching the specific range OR the 'All' range
             filters.push({ $or: [{ eligible_age_range: targetAgeRange }, { eligible_age_range: 'All' }] });
        } else {
             // If age doesn't fit a specific range, only query for 'All'
             filters.push({ eligible_age_range: 'All' });
        }
     } else {
         // If age is not a number or negative, only look for schemes applicable to 'All' ages
         filters.push({ eligible_age_range: 'All' });
     }


    const query = filters.length ? { $and: filters } : {};
    console.log("MongoDB Query:", JSON.stringify(query));

    const schemes = await Scheme.find(query).limit(10).select('scheme_name link_to_apply benefits eligibility_criteria -_id').lean();
    console.log(`Found ${schemes.length} matching schemes.`);

    // --- Format Final Answer ---
    const answer = schemes.length
      ? schemes.map(s => `• Scheme: ${s.scheme_name}
  ↳ Link: ${s.link_to_apply || 'Not available'}
  ↳ Benefits: ${s.benefits || 'Details not specified'}
  ↳ Eligibility Notes: ${s.eligibility_criteria || 'General eligibility applies'}`)
        .join('\n\n')
      : 'Based on the extracted details, no specific schemes were found matching all criteria. General government schemes may still apply.';

    // --- Return Success Response ---
    return NextResponse.json({ profile, answer });

  } catch (err: any) {
    // --- General Error Handling ---
    console.error('Unhandled Error in /api/ocr:', err);
    if (err.response && err.response.status) {
        console.error(`Gemini API Error: Status ${err.response.status}`, JSON.stringify(err.response.data || err.message));
        return NextResponse.json(
          { error: 'Failed to communicate with AI service.', details: err.response.data?.error?.message || err.message },
          { status: err.response.status || 500 }
        );
    } else {
        console.error('Error Message:', err.message);
        console.error('Error Stack:', err.stack);
        return NextResponse.json(
            { error: 'An internal server error occurred.', details: err.message },
            { status: 500 }
        );
    }
  }
}