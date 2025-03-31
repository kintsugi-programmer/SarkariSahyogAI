// models/Scheme.ts

import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IScheme extends Document {
  scheme_name: string;
  link_to_apply: string;
  category: string;
  details_description?: string;
  eligibility_criteria?: string;
  benefits?: string;
  application_process?: string;
  documents_required?: string;
  scheme_apply_date?: Date;
  scheme_status?: 'open' | 'closed';
  eligible_state: string;
  eligible_gender?: string;
  eligible_age_range?: string;
  eligible_caste?: string;
  ministry_name: string;
  eligible_residence?: string;
  is_minority_eligible?: string;
  is_differently_abled_eligible?: string;
  benefit_type: string;
  is_dbt_scheme?: string;
  eligible_marital_status?: string;
  eligible_disability_percentage?: string;
  is_below_poverty_line?: string;
  is_economic_distress?: string;
  employment_status?: string;
  eligible_occupation?: string;
  application_mode?: string;
  scheme_type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schemeSchema = new Schema<IScheme>(
  {
    scheme_name: { type: String, required: true },
    link_to_apply: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Agriculture, Rural & Environment',
        'Banking, Financial Services and Insurance',
        'Business & Entrepreneurship',
        'Education & Learning',
        'Health & Wellness',
        'Housing & Shelter',
        'Public Safety,Law & Justice',
        'Science, IT & Communications',
        'Skills & Employment',
        'Social welfare & Empowerment',
        'Sports & Culture',
        'Transport & Infrastructure',
        'Travel & Tourism',
        'Utility & Sanitation',
        'Women and Child',
      ],
      required: true,
    },
    details_description: String,
    eligibility_criteria: String,
    benefits: String,
    application_process: String,
    documents_required: String,
    scheme_apply_date: Date,
    scheme_status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    eligible_state: {
      type: String,
      enum: [
        'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
        'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
        'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
        'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
        'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
        'The Dadra And Nagar Haveli And Daman And Diu', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
        'West Bengal',
      ],
      required: true,
    },
    eligible_gender: {
      type: String,
      enum: ['all', 'female', 'male', 'transgender'],
      default: 'all',
    },
    eligible_age_range: {
      type: String,
      enum: [
        '0-10', '11-20', '21-30', '31-40', '41-50', '51-60',
        '61-70', '71-80', '81-90', '91-100', '100+',
      ],
      default: '0-10',
    },
    eligible_caste: {
      type: String,
      enum: ['all', 'SC', 'ST', 'OBC', 'PVTG', 'General'],
      default: 'all',
    },
    ministry_name: {
      type: String,
      enum: [
        'Comptroller And Auditor General Of India',
        'Ministry Of Agriculture and Farmers Welfare',
        'Ministry Of Chemicals And Fertilizers',
        'Ministry Of Commerce And Industry',
        'Ministry Of Communication',
        'Ministry Of Consumer Affairs, Food And Public Distribution',
        'Ministry of Corporate Affairs',
        'Ministry Of Culture',
        'Ministry Of Defence',
        'Ministry Of Development Of North Eastern Region',
        'Ministry Of Earth Sciences',
        'Ministry of Education',
        'Ministry of Electronics and Information Technology',
        'Ministry Of Environment, forests and climate change',
        'Ministry Of External Affairs',
        'Ministry Of Finance',
        'Ministry of Fisheries,Animal Husbandry and Dairying',
        'Ministry of Food Processing Industries',
        'Ministry Of Health & Family Welfare',
        'Ministry of Heavy Industries',
        'Ministry Of Home Affairs',
        'Ministry Of Housing & Urban Affairs',
        'Ministry Of Information And Broadcasting',
        'Ministry Of Jal Shakti',
        'Ministry Of Labour and Employment',
        'Ministry Of Law and Justice',
        'Ministry Of Micro, Small and Medium Enterprises',
        'Ministry Of Minority Affairs',
        'Ministry Of New and Renewable Energy',
        'Ministry Of Panchayati Raj',
        'Ministry Of Personnel, Public Grievances And Pensions',
        'Ministry Of Petroleum and Natural Gas',
        'Ministry of Ports,Shipping and Waterways',
        'Ministry Of Railways',
        'Ministry Of Road Transport & Highways',
        'Ministry Of Rural Development',
        'Ministry Of Science And Technology',
        'Ministry Of Skill Development And Entrepreneurship',
        'Ministry Of Social Justice and Empowerment',
        'Ministry Of Statistics and Programme Implementation',
        'Ministry Of Textiles',
        'Ministry Of Tourism',
        'Ministry Of Tribal Affairs',
        'Ministry of Women and Child Development',
        'Ministry Of Youth Affairs & Sports',
        'NITI Aayog (National Institution for Transforming India)',
        'The Lokpal of India',
      ],
      required: true,
    },
    eligible_residence: {
      type: String,
      enum: ['both', 'rural', 'urban'],
      default: 'both',
    },
    is_minority_eligible: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
    is_differently_abled_eligible: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
    benefit_type: {
      type: String,
      enum: ['Cash', 'Composite', 'In Kind'],
      required: true,
    },
    is_dbt_scheme: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
    eligible_marital_status: {
      type: String,
      enum: ['all', 'widowed', 'divorced', 'separated', 'married', 'never married'],
      default: 'all',
    },
    eligible_disability_percentage: {
      type: String,
      enum: [
        '0','0-10', '11-20', '21-30', '31-40', '41-50',
        '51-60', '61-70', '71-80', '81-90', '91-100',
      ],
      default: '0-10',
    },
    is_below_poverty_line: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
    is_economic_distress: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
    employment_status: {
      type: String,
      enum: [
        'all', 'employed', 'unemployed', 'student', 'self-employed', 'freelancer',
        'retired', 'homemaker', 'daily wage worker', 'contractual worker', 'gig worker',
      ],
      default: 'all',
    },
    eligible_occupation: {
      type: String,
      enum: [
        'All', 'Student', 'Construction Worker', 'Unorganized Worker', 'Organized Worker',
        'Safai Karamchari', 'Ex Servicemen', 'Teacher / Faculty', 'Artists', 'Farmer',
        'Khadi Artisan', 'Weaver', 'Driver', 'Electrician', 'Plumber', 'Healthcare Worker',
        'Entrepreneur', 'Government Employee', 'Private Sector Employee', 'ASHA Worker',
        'Anganwadi Worker', 'Street Vendor', 'Self Help Group Member',
      ],
      default: 'All',
    },
    application_mode: {
      type: String,
      enum: ['Online', 'Offline', 'Online - via CSCs'],
      default: 'Online',
    },
    scheme_type: {
      type: String,
      enum: ['Central Sector Scheme', 'Centrally Sponsored Scheme'],
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Scheme || model<IScheme>('Scheme', schemeSchema);
