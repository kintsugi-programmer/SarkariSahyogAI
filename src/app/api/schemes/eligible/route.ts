import connectToDatabase from '@/lib/mongoose';
import Scheme from '@/models/Scheme';
import { NextResponse } from 'next/server';
import type { PipelineStage } from 'mongoose';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    // ENUMS from the model
    const GENDERS = ['all', 'female', 'male', 'transgender'];
    const AGE_RANGES = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100', '100+'];
    const CASTES = ['all', 'SC', 'ST', 'OBC', 'PVTG', 'General'];
    const STATES = [
      'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
      'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
      'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
      'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
      'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
      'The Dadra And Nagar Haveli And Daman And Diu', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
      'West Bengal'
    ];
    const RESIDENCE_OPTIONS = ['both', 'rural', 'urban'];
    const YES_NO = ['yes', 'no'];
    const EMPLOYMENT_STATUSES = [
      'all', 'employed', 'unemployed', 'student', 'self-employed', 'freelancer',
      'retired', 'homemaker', 'daily wage worker', 'contractual worker', 'gig worker',
    ];
    const OCCUPATIONS = [
      'All', 'Student', 'Construction Worker', 'Unorganized Worker', 'Organized Worker',
      'Safai Karamchari', 'Ex Servicemen', 'Teacher / Faculty', 'Artists', 'Farmer',
      'Khadi Artisan', 'Weaver', 'Driver', 'Electrician', 'Plumber', 'Healthcare Worker',
      'Entrepreneur', 'Government Employee', 'Private Sector Employee', 'ASHA Worker',
      'Anganwadi Worker', 'Street Vendor', 'Self Help Group Member',
    ];

    // Destructure request body
    const {
      gender,
      age,
      caste,
      state,
      residence,
      bpl,
      differentlyAbled,
      minority,
      employmentStatus,
      occupation,
    } = body;

    // Match age to age range string
    const matchedAgeRange = AGE_RANGES.find(range => {
      const [min, max] = range.includes('+')
        ? [parseInt(range), Infinity]
        : range.split('-').map(Number);
      return age >= min && age <= max;
    });
    const pipeline: PipelineStage[] = [
        {
          $addFields: {
            matchCount: {
              $add: [
                { $cond: [{ $or: [{ $eq: ['$eligible_gender', gender] }, { $eq: ['$eligible_gender', 'all'] }] }, 1, 0] },
                { $cond: [{ $or: [{ $eq: ['$eligible_caste', caste] }, { $eq: ['$eligible_caste', 'all'] }] }, 1, 0] },
                { $cond: [{ $eq: ['$eligible_state', state] }, 1, 0] },
                { $cond: [{ $or: [{ $eq: ['$eligible_residence', residence] }, { $eq: ['$eligible_residence', 'both'] }] }, 1, 0] },
                { $cond: [{ $or: [{ $eq: ['$is_below_poverty_line', bpl] }, { $eq: ['$is_below_poverty_line', 'no'] }] }, 1, 0] },
                { $cond: [{ $or: [{ $eq: ['$is_differently_abled_eligible', differentlyAbled] }, { $eq: ['$is_differently_abled_eligible', 'no'] }] }, 1, 0] },
                { $cond: [{ $or: [{ $eq: ['$is_minority_eligible', minority] }, { $eq: ['$is_minority_eligible', 'no'] }] }, 1, 0] },
                { $cond: [{ $or: [{ $eq: ['$employment_status', employmentStatus] }, { $eq: ['$employment_status', 'all'] }] }, 1, 0] },
                { $cond: [{ $or: [{ $eq: ['$eligible_occupation', occupation] }, { $eq: ['$eligible_occupation', 'All'] }] }, 1, 0] },
                { $cond: [{ $eq: ['$eligible_age_range', matchedAgeRange] }, 1, 0] },
              ]
            }
          }
        },
        {
          $match: {
            matchCount: { $gte: 3 }
          }
        },
        {
          $sort: {
            matchCount: -1
          }
        }
      ] as PipelineStage[];
      
    const matchedSchemes = await Scheme.aggregate(pipeline);

    return NextResponse.json({ success: true, data: matchedSchemes });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// results json
// [
//     {
//       "_id": "...",
//       "scheme_name": "...",
//       "matchCount": 9,
//       ...
//     },
//     ...
//   ]
  