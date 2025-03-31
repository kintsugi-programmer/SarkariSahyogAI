// app/eligibility-checker/page.tsx

'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const genders = ['all','female', 'male', 'transgender'];
const castes = ['all','SC', 'ST', 'OBC', 'PVTG', 'General'];
const residences = ['both','rural', 'urban'];
const yesNo = ['yes', 'no'];
const employmentStatuses = [
  'all','employed', 'unemployed', 'student', 'self-employed', 'freelancer',
  'retired', 'homemaker', 'daily wage worker', 'contractual worker', 'gig worker',
];
const occupations = [
  'All','Student', 'Construction Worker', 'Unorganized Worker', 'Organized Worker',
  'Safai Karamchari', 'Ex Servicemen', 'Teacher / Faculty', 'Artists', 'Farmer',
  'Khadi Artisan', 'Weaver', 'Driver', 'Electrician', 'Plumber', 'Healthcare Worker',
  'Entrepreneur', 'Government Employee', 'Private Sector Employee', 'ASHA Worker',
  'Anganwadi Worker', 'Street Vendor', 'Self Help Group Member',
];
const states = [
  'Delhi', 'Uttar Pradesh', 'Bihar', 'Maharashtra', 'Karnataka', 'Tamil Nadu',
  'Rajasthan', 'West Bengal', 'Punjab', 'Kerala', 'Gujarat', 'Andhra Pradesh',
  'Madhya Pradesh', 'Odisha', 'Haryana', 'Telangana', 'Jharkhand',
];

export default function EligibilityCheckerPage() {
  const [form, setForm] = useState({
    age: '',
    gender: '',
    caste: '',
    state: '',
    residence: '',
    bpl: '',
    differentlyAbled: '',
    minority: '',
    employmentStatus: '',
    occupation: '',
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/schemes/eligible', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        age: parseInt(form.age),
      }),
    });
    const data = await res.json();
    if (!data.data || data.data.length === 0) {
      alert('No matching schemes found based on your inputs.');
    }
    setResults(data.data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 sm:pt-[50vh]">
      <Card className="shadow-xl rounded-xl">
        <CardContent className="p-6">
          <h2 className="mb-6 max-w-4xl text-center font-black text-[#155e75] leading-[1.15] text-2xl md:leading-[1.15]">Check Your Eligibility</h2>
          <ScrollArea className="h-[75vh] pr-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input type="number" name="age" value={form.age} onChange={(e) => handleChange('age', e.target.value)} />
              </div>

              {[
                { key: 'gender', label: 'Gender', values: genders },
                { key: 'caste', label: 'Caste', values: castes },
                { key: 'state', label: 'State', values: states },
                { key: 'residence', label: 'Residence', values: residences },
                { key: 'bpl', label: 'Below Poverty Line (BPL)?', values: yesNo },
                { key: 'differentlyAbled', label: 'Differently Abled?', values: yesNo },
                { key: 'minority', label: 'Minority?', values: yesNo },
                { key: 'employmentStatus', label: 'Employment Status', values: employmentStatuses },
                { key: 'occupation', label: 'Occupation', values: occupations },
              ].map(({ key, label, values }) => (
                <div key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <select
                    id={key}
                    name={key}
                    className="w-full border rounded p-2"
                    onChange={(e) => handleChange(key, e.target.value)}
                    value={form[key as keyof typeof form]}
                  >
                    <option value="">Select</option>
                    {values.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              ))}

              <Button type="submit" className="w-full rounded-lg bg-[#155e75] p-3 uppercase text-white transition-colors hover:bg-cyan-950" disabled={loading}>
                {loading ? 'Checking...' : 'Check Eligibility'}
              </Button>
            </form>
          </ScrollArea>

          {results.length > 0 && (
            <div className="space-y-4 mt-8">
              <h2 className="text-xl font-medium">Eligible Schemes</h2>
              {results.map((scheme, idx) => (
                <Card key={scheme._id || idx}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{scheme.scheme_name}</h3>
                    <p className="text-sm text-muted-foreground">Match Score: {scheme.matchCount}/10</p>
                    <p className="text-sm mt-2">{scheme.details_description}</p>
                    <a className="text-blue-600 underline text-sm" href={scheme.link_to_apply} target="_blank">Apply Link</a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
