"use client";
import { useState } from "react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  province: string;
  municipalityLegalDescription: string;
  totalAcreage: string;
  askingPrice: string;
  dispositionType: string;
  ecologicalFeatures: string[];
  speciesAtRisk: string;
  waterFeatures: string;
  adjacentProtected: string;
  existingEncumbrances: string;
  motivation: string;
  timeline: string;
  additionalInfo: string;
};

const provinces = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Québec",
  "Saskatchewan", "Yukon",
];

const ecologicalFeatureOptions = [
  "Old-growth forest", "Wetlands / marshes / bogs", "Native grasslands",
  "Riparian corridor", "Coastal / marine interface", "Peatland",
  "Documented species at risk habitat", "Migratory bird stopover",
  "Caribou / ungulate range", "Fish-bearing waterways",
];

const dispositionTypes = [
  { value: "sale", label: "Fee Simple Sale" },
  { value: "donation", label: "Conservation Donation (Charitable Receipt)" },
  { value: "easement", label: "Conservation Easement" },
  { value: "covenant", label: "Conservation Covenant (BC)" },
  { value: "unsure", label: "Unsure — open to guidance" },
];

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    province: "", municipalityLegalDescription: "", totalAcreage: "",
    askingPrice: "", dispositionType: "",
    ecologicalFeatures: [], speciesAtRisk: "", waterFeatures: "",
    adjacentProtected: "", existingEncumbrances: "",
    motivation: "", timeline: "", additionalInfo: "",
  });

  const set = (field: keyof FormData, value: string | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleFeature = (f: string) =>
    set("ecologicalFeatures",
      form.ecologicalFeatures.includes(f)
        ? form.ecologicalFeatures.filter((x) => x !== f)
        : [...form.ecologicalFeatures, f]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-6">🌿</div>
        <h1 className="text-3xl font-bold mb-4">Thank you for submitting</h1>
        <p className="text-[#4a5e4c] leading-relaxed mb-8">
          We&rsquo;ve received your property intake form. A member of our ecological assessment team will be in touch within 5 business days to schedule a call and discuss next steps.
        </p>
        <a href="/listings" className="inline-block bg-[#3d6b42] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#2e5233] transition-colors">
          Browse current listings
        </a>
      </div>
    );
  }

  const totalSteps = 3;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="text-[#3d6b42] text-xs font-medium uppercase tracking-widest">For Landowners</span>
        <h1 className="text-4xl font-bold mt-2 mb-3">Submit Your Property</h1>
        <p className="text-[#4a5e4c]">Tell us about your land. Our ecological assessment team will review it and reach out with next steps — no obligation.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${i + 1 <= step ? "bg-[#3d6b42] text-white" : "bg-[#e0ddd6] text-[#8a9e8c]"}`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i + 1 === step ? "text-[#1a2e1c] font-medium" : "text-[#8a9e8c]"}`}>
              {["Your Details", "Property Info", "Ecology & Intent"][i]}
            </span>
            {i < totalSteps - 1 && <div className={`h-px flex-1 mx-2 ${i + 1 < step ? "bg-[#3d6b42]" : "bg-[#d4cfc4]"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#d4cfc4] shadow-sm p-8">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold mb-6">Your contact details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="First Name" required>
                <input className={inputCls} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
              </Field>
              <Field label="Last Name" required>
                <input className={inputCls} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
              </Field>
            </div>
            <Field label="Email Address" required>
              <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} required />
            </Field>
            <Field label="Phone Number">
              <input type="tel" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Your role" hint="Are you the landowner, an agent, or a legal representative?">
              <select className={inputCls} defaultValue="">
                <option value="" disabled>Select…</option>
                <option>Landowner (individual)</option>
                <option>Landowner (family / estate)</option>
                <option>Real estate agent / broker</option>
                <option>Legal representative / executor</option>
                <option>Other</option>
              </select>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold mb-6">Property details</h2>
            <Field label="Province / Territory" required>
              <select className={inputCls} value={form.province} onChange={(e) => set("province", e.target.value)} required>
                <option value="" disabled>Select a province or territory…</option>
                {provinces.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Municipality & Legal Description" hint="Township, range, meridian, or civic address as available">
              <textarea className={`${inputCls} resize-none`} rows={2} value={form.municipalityLegalDescription} onChange={(e) => set("municipalityLegalDescription", e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Total Acreage" required>
                <input type="number" min="1" className={inputCls} value={form.totalAcreage} onChange={(e) => set("totalAcreage", e.target.value)} required placeholder="e.g. 450" />
              </Field>
              <Field label="Asking Price (CAD)" hint="Leave blank if open or donation">
                <input type="number" min="0" className={inputCls} value={form.askingPrice} onChange={(e) => set("askingPrice", e.target.value)} placeholder="e.g. 1500000" />
              </Field>
            </div>
            <Field label="Preferred Disposition Type" required>
              <div className="space-y-2">
                {dispositionTypes.map((d) => (
                  <label key={d.value} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="disposition" value={d.value} checked={form.dispositionType === d.value} onChange={() => set("dispositionType", d.value)} className="accent-[#3d6b42]" required />
                    <span className="text-sm">{d.label}</span>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Existing Encumbrances" hint="Mortgages, leases, easements, mineral rights, etc.">
              <textarea className={`${inputCls} resize-none`} rows={2} value={form.existingEncumbrances} onChange={(e) => set("existingEncumbrances", e.target.value)} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold mb-6">Ecological context & your intent</h2>
            <Field label="Ecological Features Present" hint="Select all that apply">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ecologicalFeatureOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={form.ecologicalFeatures.includes(opt)} onChange={() => toggleFeature(opt)} className="accent-[#3d6b42]" />
                    {opt}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Known Species at Risk" hint="List any COSEWIC- or provincially-listed species you are aware of">
              <textarea className={`${inputCls} resize-none`} rows={2} value={form.speciesAtRisk} onChange={(e) => set("speciesAtRisk", e.target.value)} placeholder="e.g. Bobolink, Eastern Meadowlark, Wood Turtle…" />
            </Field>
            <Field label="Water Features" hint="Creeks, lakes, wetlands, floodplains, springs">
              <textarea className={`${inputCls} resize-none`} rows={2} value={form.waterFeatures} onChange={(e) => set("waterFeatures", e.target.value)} />
            </Field>
            <Field label="Adjacent Protected Areas" hint="Nearby parks, conservation areas, or protected lands">
              <input className={inputCls} value={form.adjacentProtected} onChange={(e) => set("adjacentProtected", e.target.value)} />
            </Field>
            <Field label="Your Motivation" hint="Why are you considering conservation disposition?">
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.motivation} onChange={(e) => set("motivation", e.target.value)} placeholder="e.g. Retiring from farming, want to ensure permanent protection, tax planning…" />
            </Field>
            <Field label="Timeline">
              <select className={inputCls} value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>
                <option value="">No particular urgency</option>
                <option>Within 6 months</option>
                <option>6–18 months</option>
                <option>2–5 years</option>
                <option>Estate planning (long-term)</option>
              </select>
            </Field>
            <Field label="Anything else we should know?">
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.additionalInfo} onChange={(e) => set("additionalInfo", e.target.value)} />
            </Field>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-[#eceae4]">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(s => s - 1)} className="px-6 py-3 border border-[#d4cfc4] rounded-full text-sm font-medium text-[#4a5e4c] hover:border-[#3d6b42] transition-colors">
              ← Back
            </button>
          ) : <div />}
          {step < totalSteps ? (
            <button type="button" onClick={() => setStep(s => s + 1)} className="bg-[#3d6b42] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#2e5233] transition-colors">
              Continue →
            </button>
          ) : (
            <button type="submit" className="bg-[#1a2e1c] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#2e4d30] transition-colors">
              Submit Property
            </button>
          )}
        </div>
      </form>

      <p className="text-xs text-[#8a9e8c] text-center mt-6">
        Your information is used solely to assess your property and match you with appropriate buyers. We do not share your data without consent.
      </p>
    </div>
  );
}

const inputCls = "w-full border border-[#d4cfc4] rounded-xl px-4 py-2.5 text-sm bg-[#f9f8f5] focus:outline-none focus:ring-2 focus:ring-[#3d6b42]/30 focus:border-[#3d6b42] transition-colors";

function Field({ label, children, hint, required }: { label: string; children: React.ReactNode; hint?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a2e1c] mb-1.5">
        {label}{required && <span className="text-[#3d6b42] ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-[#8a9e8c] mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}
