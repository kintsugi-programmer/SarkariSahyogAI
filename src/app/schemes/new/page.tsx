'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


export default function NewSchemeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    scheme_name: '',
    link_to_apply: '',
    category: '',
    details_description: '',
    eligibility_criteria: '',
    benefits: '',
    application_process: '',
    documents_required: '',
    scheme_apply_date: '',
    scheme_status: '', // was 'open'
    eligible_state: '',
    eligible_gender: '', // was 'all'
    eligible_age_range: '',
    eligible_caste: '',
    ministry_name: '',
    eligible_residence: '',
    is_minority_eligible: '',
    is_differently_abled_eligible: '',
    benefit_type: '',
    is_dbt_scheme: '',
    eligible_marital_status: '',
    eligible_disability_percentage: '',
    is_below_poverty_line: '',
    is_economic_distress: '', // was 'no'
    employment_status: '',    // was 'all'
    eligible_occupation: '',
    application_mode: '',
    scheme_type: '',
  });
  

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      alert('Failed to create scheme');
    } finally {
      setLoading(false);
    }
  };

  const textFields = [
    { name: 'scheme_name', label: 'Scheme Name' },
    { name: 'link_to_apply', label: 'Link to Apply' },
    { name: 'details_description', label: 'Details Description' },
    { name: 'eligibility_criteria', label: 'Eligibility Criteria' },
    { name: 'benefits', label: 'Benefits' },
    { name: 'application_process', label: 'Application Process' },
    { name: 'documents_required', label: 'Documents Required' },
  ];

  const enums = {
    category: [
      'Agriculture, Rural & Environment', 'Banking, Financial Services and Insurance', 'Business & Entrepreneurship', 'Education & Learning', 'Health & Wellness', 'Housing & Shelter', 'Public Safety,Law & Justice', 'Science, IT & Communications', 'Skills & Employment', 'Social welfare & Empowerment', 'Sports & Culture', 'Transport & Infrastructure', 'Travel & Tourism', 'Utility & Sanitation', 'Women and Child'
    ],
    eligible_state: [
      'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'The Dadra And Nagar Haveli And Daman And Diu', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ],
    eligible_gender: ['all', 'female', 'male', 'transgender'],
    eligible_age_range: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100', '100+'],
    eligible_caste: ['all', 'SC', 'ST', 'OBC', 'PVTG', 'General'],
    ministry_name: [
      'Comptroller And Auditor General Of India', 'Ministry Of Agriculture and Farmers Welfare', 'Ministry Of Chemicals And Fertilizers', 'Ministry Of Commerce And Industry', 'Ministry Of Communication', 'Ministry Of Consumer Affairs, Food And Public Distribution', 'Ministry of Corporate Affairs', 'Ministry Of Culture', 'Ministry Of Defence', 'Ministry Of Development Of North Eastern Region', 'Ministry Of Earth Sciences', 'Ministry of Education', 'Ministry of Electronics and Information Technology', 'Ministry Of Environment, forests and climate change', 'Ministry Of External Affairs', 'Ministry Of Finance', 'Ministry of Fisheries,Animal Husbandry and Dairying', 'Ministry of Food Processing Industries', 'Ministry Of Health & Family Welfare', 'Ministry of Heavy Industries', 'Ministry Of Home Affairs', 'Ministry Of Housing & Urban Affairs', 'Ministry Of Information And Broadcasting', 'Ministry Of Jal Shakti', 'Ministry Of Labour and Employment', 'Ministry Of Law and Justice', 'Ministry Of Micro, Small and Medium Enterprises', 'Ministry Of Minority Affairs', 'Ministry Of New and Renewable Energy', 'Ministry Of Panchayati Raj', 'Ministry Of Personnel, Public Grievances And Pensions', 'Ministry Of Petroleum and Natural Gas', 'Ministry of Ports,Shipping and Waterways', 'Ministry Of Railways', 'Ministry Of Road Transport & Highways', 'Ministry Of Rural Development', 'Ministry Of Science And Technology', 'Ministry Of Skill Development And Entrepreneurship', 'Ministry Of Social Justice and Empowerment', 'Ministry Of Statistics and Programme Implementation', 'Ministry Of Textiles', 'Ministry Of Tourism', 'Ministry Of Tribal Affairs', 'Ministry of Women and Child Development', 'Ministry Of Youth Affairs & Sports', 'NITI Aayog (National Institution for Transforming India)', 'The Lokpal of India'
    ],
    eligible_residence: ['both', 'rural', 'urban'],
    is_minority_eligible: ['yes', 'no'],
    is_differently_abled_eligible: ['yes', 'no'],
    benefit_type: ['Cash', 'Composite', 'In Kind'],
    is_dbt_scheme: ['yes', 'no'],
    eligible_marital_status: ['all', 'widowed', 'divorced', 'separated', 'married', 'never married'],
    eligible_disability_percentage: ['0','0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
    is_below_poverty_line: ['yes', 'no'],
    is_economic_distress: ['yes', 'no'],
    employment_status: ['all', 'employed', 'unemployed', 'student', 'self-employed', 'freelancer', 'retired', 'homemaker', 'daily wage worker', 'contractual worker', 'gig worker'],
    eligible_occupation: ['All', 'Student', 'Construction Worker', 'Unorganized Worker', 'Organized Worker', 'Safai Karamchari', 'Ex Servicemen', 'Teacher / Faculty', 'Artists', 'Farmer', 'Khadi Artisan', 'Weaver', 'Driver', 'Electrician', 'Plumber', 'Healthcare Worker', 'Entrepreneur', 'Government Employee', 'Private Sector Employee', 'ASHA Worker', 'Anganwadi Worker', 'Street Vendor', 'Self Help Group Member'],
    application_mode: ['Online', 'Offline', 'Online - via CSCs'],
    scheme_type: ['Central Sector Scheme', 'Centrally Sponsored Scheme'],
    scheme_status: ['open', 'closed'],
  };

  return (
    <div className="max-w-4xl  mx-auto p-4 sm:p-6 md:p-8  sm:pt-[50vh] ">
      <Card className="shadow-xl rounded-xl ">
        <CardContent className="p-6 ">
          <h2 className=" mb-6 tmax-w-4xl text-center font-black text-[#155e75] leading-[1.15] text-2xl md:leading-[1.15]">Post a New Scheme</h2>
          <ScrollArea className="h-[75vh] pr-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {textFields.map(({ name, label }) => (
                <div key={name}>
                  <Label htmlFor={name}>{label}</Label>
                  <Textarea id={name} name={name} onChange={handleChange}  />
                </div>
              ))}

{Object.entries(enums).map(([key, values]) => (
  <div key={key}>
    <Label htmlFor={key}>
      {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
    </Label>
    <select
      id={key}
      name={key}
      className="w-full border rounded p-2"
      onChange={handleChange}
      value={form[key as keyof typeof form] || ''}
    >
      <option value="" disabled>
        -- Select {key.replace(/_/g, ' ')} --
      </option>
      {values.map((v) => (
        <option key={v} value={v}>{v}</option>
      ))}
    </select>
  </div>
))}



              <Button type="submit" className="w-full rounded-lg bg-[#155e75] p-3 uppercase text-white transition-colors hover:bg-cyan-950 " disabled={loading}>
                {loading ? 'Posting...' : 'Submit Scheme'}
              </Button>
            </form>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
