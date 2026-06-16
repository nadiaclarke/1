"use client";
import { useState } from "react";

type BuyerForm = {
  orgName: string;
  orgType: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  website: string;
  provinces: string[];
  minAcreage: string;
  maxAcreage: string;
  minBudget: string;
  maxBudget: string;
  acquisitionTypes: string[];
  ecologicalPriorities: string[];
  speciesFocus: string;
  carbonInterest: string;
  indigenousNationTerritory: string;
  mandate: string;
  annualAcquisitionTarget: string;
  additionalCriteria: string;
};

const provinces = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Québec",
  "Saskatchewan", "Yukon",
];

const orgTypes = [
  { value: "land-trust", label: "Land Trust (charitable)" },
  { value: "indigenous-government", label: "Indigenous Government / Nation" },
  { value: "municipality", label: "Municipality" },
  { value: "province", label: "Province / Territory" },
  { value: "corporation", label: "Corporation (CSR / Nature commitments)" },
  { value: "conservation-authority", label: "Conservation Authority" },
  { value: "federal", label: "Federal Government Agency" },
  { value: "other", label: "Other" },
];

const acquisitionTypes = [
  "Fee simple purchase", "Conservation donation acceptance",
  "Conservation easement / covenant", "Crown land designation support",
  "Transfer of Stewardship", "Lease / long-term tenure",
];

const ecologicalPriorities = [
  "Species at risk habitat", "Old-growth forest", "Wetlands & peatlands",
  "Native grasslands", "Riparian & shoreline", "Coastal & marine",
  "Wildlife corridors & connectivity", "Carbon sequestration / blue carbon",
  "Watershed & drinking water protection", "Reconciliation & Indigenous-led stewardship",
];

export default function BuyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<BuyerForm>({
    orgName: "", orgType: "", contactName: "", contactTitle: "",
    email: "", phone: "", website: "",
    provinces: [], minAcreage: "", maxAcreage: "",
    minBudget: "", maxBudget: "",
    acquisitionTypes: [], ecologicalPriorities: [],
    speciesFocus: "", carbonInterest: "", indigenousNationTerritory: "",
    mandate: "", annualAcquisitionTarget: "", additionalCriteria: "",
  });

  const set = (field: keyof BuyerForm, value: string | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggle = (field: "provinces" | "acquisitionTypes" | "ecologicalPriorities", val: string) =>
    set(field, (form[field] as string[]).includes(val)
      ? (form[field] as string[]).filter((x) => x !== val)
      : [...(form[field] as string[]), val]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-6">🦅</div>
        <h1 className="text-3xl font-bold mb-4">Welcome to the Terroir buyer network</h1>
        <p className="text-[#4a5e4c] leading-relaxed mb-8">
          Your organization has been registered. We&rsquo;ll match you with properties that meet your criteria and notify you when relevant listings become available.
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
        <span className="text-[#3d6b42] text-xs font-medium uppercase tracking-widest">For Conservation Buyers</span>
        <h1 className="text-4xl font-bold mt-2 mb-3">Register Your Organization</h1>
        <p className="text-[#4a5e4c]">Tell us your acquisition criteria. We&rsquo;ll match you with ecologically significant properties that align with your mandate — before they hit the open market.</p>
      </div>

      {/* Org type callouts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { icon: "🌿", label: "Land Trusts" },
          { icon: "🦅", label: "Indigenous Governments" },
          { icon: "🏛️", label: "Municipalities" },
          { icon: "🏢", label: "Corporations" },
        ].map((b) => (
          <div key={b.label} className="bg-white rounded-xl border border-[#d4cfc4] p-4 text-center">
            <div className="text-2xl mb-1">{b.icon}</div>
            <p className="text-xs font-medium text-[#4a5e4c]">{b.label}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${i + 1 <= step ? "bg-[#3d6b42] text-white" : "bg-[#e0ddd6] text-[#8a9e8c]"}`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i + 1 === step ? "text-[#1a2e1c] font-medium" : "text-[#8a9e8c]"}`}>
              {["Organization Info", "Acquisition Criteria", "Ecological Priorities"][i]}
            </span>
            {i < totalSteps - 1 && <div className={`h-px flex-1 mx-2 ${i + 1 < step ? "bg-[#3d6b42]" : "bg-[#d4cfc4]"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#d4cfc4] shadow-sm p-8">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold mb-6">Organization information</h2>
            <Field label="Organization Name" required>
              <input className={inputCls} value={form.orgName} onChange={(e) => set("orgName", e.target.value)} required />
            </Field>
            <Field label="Organization Type" required>
              <select className={inputCls} value={form.orgType} onChange={(e) => set("orgType", e.target.value)} required>
                <option value="" disabled>Select type…</option>
                {orgTypes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            {form.orgType === "indigenous-government" && (
              <Field label="Nation / Territory Name" hint="Which nation or traditional territory does your government represent?">
                <input className={inputCls} value={form.indigenousNationTerritory} onChange={(e) => set("indigenousNationTerritory", e.target.value)} />
              </Field>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Primary Contact Name" required>
                <input className={inputCls} value={form.contactName} onChange={(e) => set("contactName", e.target.value)} required />
              </Field>
              <Field label="Title / Role">
                <input className={inputCls} value={form.contactTitle} onChange={(e) => set("contactTitle", e.target.value)} />
              </Field>
            </div>
            <Field label="Email Address" required>
              <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} required />
            </Field>
            <Field label="Phone Number">
              <input type="tel" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Organization Website">
              <input type="url" className={inputCls} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
            </Field>
            <Field label="Mandate Summary" hint="Briefly describe your conservation mandate or acquisition goals">
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.mandate} onChange={(e) => set("mandate", e.target.value)} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold mb-6">Acquisition criteria</h2>
            <Field label="Provinces / Territories of Interest" hint="Select all that apply">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {provinces.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.provinces.includes(p)} onChange={() => toggle("provinces", p)} className="accent-[#3d6b42]" />
                    {p}
                  </label>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Minimum Acreage" hint="Smallest parcel you would consider">
                <input type="number" min="0" className={inputCls} value={form.minAcreage} onChange={(e) => set("minAcreage", e.target.value)} placeholder="e.g. 100" />
              </Field>
              <Field label="Maximum Acreage" hint="Leave blank if no upper limit">
                <input type="number" min="0" className={inputCls} value={form.maxAcreage} onChange={(e) => set("maxAcreage", e.target.value)} placeholder="e.g. 10000" />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Min. Budget per Transaction (CAD)">
                <input type="number" min="0" className={inputCls} value={form.minBudget} onChange={(e) => set("minBudget", e.target.value)} placeholder="e.g. 250000" />
              </Field>
              <Field label="Max. Budget per Transaction (CAD)">
                <input type="number" min="0" className={inputCls} value={form.maxBudget} onChange={(e) => set("maxBudget", e.target.value)} placeholder="e.g. 5000000" />
              </Field>
            </div>
            <Field label="Annual Acquisition Target (hectares or dollars)">
              <input className={inputCls} value={form.annualAcquisitionTarget} onChange={(e) => set("annualAcquisitionTarget", e.target.value)} placeholder="e.g. 500 ha/year or $2M/year" />
            </Field>
            <Field label="Preferred Acquisition Mechanisms" hint="Select all that apply">
              <div className="space-y-2">
                {acquisitionTypes.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.acquisitionTypes.includes(a)} onChange={() => toggle("acquisitionTypes", a)} className="accent-[#3d6b42]" />
                    {a}
                  </label>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold mb-6">Ecological priorities</h2>
            <Field label="Conservation Priorities" hint="Select all ecological attributes important to your mandate">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ecologicalPriorities.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.ecologicalPriorities.includes(p)} onChange={() => toggle("ecologicalPriorities", p)} className="accent-[#3d6b42]" />
                    {p}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Species Focus" hint="Any specific species, genera, or taxonomic groups you prioritize">
              <textarea className={`${inputCls} resize-none`} rows={2} value={form.speciesFocus} onChange={(e) => set("speciesFocus", e.target.value)} placeholder="e.g. Boreal Caribou, Atlantic salmon, Blanding's Turtle…" />
            </Field>
            <Field label="Carbon / Nature Credit Interest" hint="Is your organization pursuing nature-based carbon credits or biodiversity credits?">
              <select className={inputCls} value={form.carbonInterest} onChange={(e) => set("carbonInterest", e.target.value)}>
                <option value="">Not a priority</option>
                <option>Yes — pursuing voluntary carbon credits</option>
                <option>Yes — pursuing biodiversity / nature credits</option>
                <option>Both carbon and biodiversity credits</option>
                <option>Exploring — want to learn more</option>
              </select>
            </Field>
            <Field label="Additional Criteria or Notes">
              <textarea className={`${inputCls} resize-none`} rows={4} value={form.additionalCriteria} onChange={(e) => set("additionalCriteria", e.target.value)} placeholder="Any other requirements, constraints, or context that would help us match you with the right properties…" />
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
              Register Organization
            </button>
          )}
        </div>
      </form>

      <p className="text-xs text-[#8a9e8c] text-center mt-6">
        Buyer registrations are reviewed by our team. We may reach out to verify your organization before activating your profile.
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
