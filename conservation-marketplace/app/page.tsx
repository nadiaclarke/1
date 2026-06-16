import Link from "next/link";

const stats = [
  { value: "163M+", label: "Hectares of ecologically sensitive land in Canada" },
  { value: "12%", label: "Currently protected — well below the 30×30 target" },
  { value: "$1.4B+", label: "Committed to nature-based solutions by federal government" },
];

const howItWorks = [
  {
    step: "01",
    title: "Submit your land",
    desc: "Landowners fill out our intake form. We gather basic property details and ecological context.",
  },
  {
    step: "02",
    title: "Ecological scoring",
    desc: "Our team assesses species habitat, wetlands, carbon stock, watershed priority, and connectivity using GIS and field data.",
  },
  {
    step: "03",
    title: "Match with buyers",
    desc: "Registered land trusts, Indigenous governments, municipalities, and corporations receive matched listings based on their criteria.",
  },
  {
    step: "04",
    title: "Close the deal",
    desc: "We support negotiations toward sale, donation, conservation easement, or covenant — whatever fits.",
  },
];

const buyerTypes = [
  { icon: "🌿", label: "Land Trusts", desc: "National and regional organizations acquiring land for permanent protection." },
  { icon: "🦅", label: "Indigenous Governments", desc: "Nations reclaiming and stewarding their ancestral territories." },
  { icon: "🏛️", label: "Municipalities", label2: "& Provinces", desc: "Governments expanding greenbelts, watersheds, and natural heritage systems." },
  { icon: "🏢", label: "Corporations", desc: "Companies meeting biodiversity commitments and nature-based carbon targets." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#1a2e1c] via-[#2e4d30] to-[#3d6b42] overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <span className="inline-block bg-[#a8d5b0]/20 text-[#a8d5b0] text-xs font-medium px-3 py-1 rounded-full mb-6 border border-[#a8d5b0]/30">
              Canada&rsquo;s Conservation Land Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Land worth<br />
              <span className="text-[#a8d5b0]">protecting.</span>
            </h1>
            <p className="text-xl text-[#c8deca] mb-10 max-w-xl leading-relaxed">
              Terroir connects landowners with vetted conservation buyers — land trusts, Indigenous governments, municipalities, and corporations — using rigorous ecological scoring to match the right land with the right steward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sell" className="bg-white text-[#1a2e1c] px-8 py-4 rounded-full font-semibold text-sm hover:bg-[#f0f0ed] transition-colors text-center">
                List Your Land
              </Link>
              <Link href="/listings" className="border border-white/40 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors text-center">
                Browse Listings
              </Link>
              <Link href="/buy" className="border border-[#a8d5b0]/50 text-[#a8d5b0] px-8 py-4 rounded-full font-semibold text-sm hover:bg-[#a8d5b0]/10 transition-colors text-center">
                Register as Buyer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#eceae4] border-b border-[#d4cfc4]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <p className="text-4xl font-bold text-[#3d6b42] mb-2">{s.value}</p>
              <p className="text-sm text-[#4a5e4c] leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How Terroir works</h2>
          <p className="text-[#4a5e4c] max-w-xl mx-auto">From intake to conservation agreement — a transparent, ecology-first process.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((item) => (
            <div key={item.step} className="relative">
              <div className="text-6xl font-bold text-[#3d6b42]/10 mb-4 leading-none">{item.step}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-[#4a5e4c] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ecological Scoring Explainer */}
      <section className="bg-[#1a2e1c] text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#a8d5b0] text-xs font-medium uppercase tracking-widest">Ecological Intelligence</span>
              <h2 className="text-4xl font-bold mt-3 mb-6">Every listing is ecologically scored</h2>
              <p className="text-[#c8deca] leading-relaxed mb-8">
                Unlike traditional real estate platforms, Terroir evaluates land on dimensions that matter for conservation. Our assessment team and GIS tools score each property across five ecological attributes — giving buyers the clarity they need and sellers the recognition their land deserves.
              </p>
              <Link href="/listings" className="inline-block bg-[#3d6b42] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#2e5233] transition-colors">
                See a sample listing →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Species at Risk Habitat", icon: "🦋", desc: "COSEWIC-listed species presence and critical habitat overlap" },
                { label: "Wetland Class", icon: "🌾", desc: "Ramsar and provincial wetland classification and condition" },
                { label: "Carbon Stock Estimate", icon: "🌲", desc: "Above and below-ground carbon sequestration potential (tCO₂e/ha)" },
                { label: "Watershed Priority", icon: "💧", desc: "Drinking water source protection and riparian health score" },
                { label: "Connectivity Value", icon: "🗺️", desc: "Linkage to existing protected areas and wildlife corridors" },
              ].map((attr) => (
                <div key={attr.label} className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                  <span className="text-2xl">{attr.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{attr.label}</p>
                    <p className="text-xs text-[#a8bfaa] mt-0.5">{attr.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who Buys */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Who buys through Terroir</h2>
          <p className="text-[#4a5e4c] max-w-xl mx-auto">Our buyer registry includes organizations with mandates and capital committed to permanent land protection.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {buyerTypes.map((b) => (
            <div key={b.label} className="bg-white rounded-2xl p-6 border border-[#d4cfc4] shadow-sm">
              <div className="text-4xl mb-4">{b.icon}</div>
              <h3 className="font-semibold mb-2">{b.label}</h3>
              <p className="text-sm text-[#4a5e4c] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/buy" className="inline-block bg-[#1a2e1c] text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-[#2e4d30] transition-colors">
            Register your organization →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#eceae4] border-t border-[#d4cfc4] py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Your land has ecological value.<br />Let&rsquo;s find it a future.</h2>
        <p className="text-[#4a5e4c] mb-8 max-w-lg mx-auto">Terroir handles the ecological assessment, the buyer matching, and the deal structuring — so you can focus on the decision that matters.</p>
        <Link href="/sell" className="inline-block bg-[#3d6b42] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#2e5233] transition-colors">
          Submit your property
        </Link>
      </section>
    </div>
  );
}
