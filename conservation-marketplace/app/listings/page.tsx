import Link from "next/link";

type EcoScore = {
  speciesAtRisk: number;
  wetlandClass: string;
  carbonStock: number;
  watershedPriority: number;
  connectivity: number;
};

type Listing = {
  id: string;
  name: string;
  province: string;
  acreage: number;
  askingPrice: number | null;
  priceType: "sale" | "donation" | "easement";
  bio: string;
  tags: string[];
  ecoScore: EcoScore;
  overallScore: number;
};

const listings: Listing[] = [
  {
    id: "1",
    name: "Algonquin Highlands Buffer Parcel",
    province: "Ontario",
    acreage: 847,
    askingPrice: 2400000,
    priceType: "sale",
    bio: "Mixed boreal forest adjacent to Algonquin Provincial Park. Documented moose calving grounds and significant old-growth hemlock stands.",
    tags: ["Old Growth", "Moose Habitat", "Riparian"],
    ecoScore: {
      speciesAtRisk: 82,
      wetlandClass: "Class IV Swamp",
      carbonStock: 210,
      watershedPriority: 91,
      connectivity: 95,
    },
    overallScore: 92,
  },
  {
    id: "2",
    name: "Peace River Grassland Tract",
    province: "Alberta",
    acreage: 2340,
    askingPrice: null,
    priceType: "donation",
    bio: "Native fescue grassland in the Peace River region. Critical habitat for Sprague's Pipit and Baird's Sparrow — both COSEWIC Threatened.",
    tags: ["Native Grassland", "COSEWIC Threatened", "Carbon Sink"],
    ecoScore: {
      speciesAtRisk: 94,
      wetlandClass: "Seasonal Wetland",
      carbonStock: 145,
      watershedPriority: 67,
      connectivity: 73,
    },
    overallScore: 88,
  },
  {
    id: "3",
    name: "Cowichan Valley Riparian Reserve",
    province: "British Columbia",
    acreage: 312,
    askingPrice: 1850000,
    priceType: "sale",
    bio: "Old-growth Douglas fir and western red cedar along a salmon-bearing tributary of the Cowichan River. High connectivity to Cowichan River Provincial Park.",
    tags: ["Salmon Habitat", "Old Growth", "Riparian"],
    ecoScore: {
      speciesAtRisk: 88,
      wetlandClass: "Riparian Forest",
      carbonStock: 380,
      watershedPriority: 96,
      connectivity: 89,
    },
    overallScore: 94,
  },
  {
    id: "4",
    name: "Mingan Archipelago Coastal Buffer",
    province: "Québec",
    acreage: 1180,
    askingPrice: 3100000,
    priceType: "sale",
    bio: "Boreal coastal habitat adjacent to Mingan Archipelago National Park Reserve. Documented breeding habitat for Arctic Tern and Common Eider.",
    tags: ["Coastal", "Seabird Nesting", "Boreal"],
    ecoScore: {
      speciesAtRisk: 76,
      wetlandClass: "Coastal Marsh",
      carbonStock: 88,
      watershedPriority: 72,
      connectivity: 97,
    },
    overallScore: 85,
  },
  {
    id: "5",
    name: "Tantramar Marshlands Parcel",
    province: "New Brunswick",
    acreage: 560,
    askingPrice: 890000,
    priceType: "easement",
    bio: "Dyked and undyked saltmarsh on the Tantramar watershed. One of Atlantic Canada's most significant bird migration stopovers.",
    tags: ["Saltmarsh", "Migratory Birds", "Ramsar Adjacent"],
    ecoScore: {
      speciesAtRisk: 79,
      wetlandClass: "Class V Marsh",
      carbonStock: 310,
      watershedPriority: 84,
      connectivity: 81,
    },
    overallScore: 87,
  },
  {
    id: "6",
    name: "Nopiming Wilderness Adjunct",
    province: "Manitoba",
    acreage: 4200,
    askingPrice: null,
    priceType: "donation",
    bio: "Canadian Shield wilderness contiguous with Nopiming Provincial Park. Pristine lake systems supporting lake sturgeon and woodland caribou.",
    tags: ["Wilderness", "Lake Sturgeon", "Caribou"],
    ecoScore: {
      speciesAtRisk: 91,
      wetlandClass: "Class III Bog",
      carbonStock: 175,
      watershedPriority: 88,
      connectivity: 99,
    },
    overallScore: 96,
  },
];

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 80 ? "bg-[#3d6b42]" : pct >= 60 ? "bg-[#7aaa7e]" : "bg-[#b5cdb7]";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#e0ddd6] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-[#3d6b42] w-6 text-right">{value}</span>
    </div>
  );
}

function priceLabel(listing: Listing) {
  if (listing.priceType === "donation") return "Conservation Donation";
  if (listing.priceType === "easement") return `$${listing.askingPrice?.toLocaleString()} (Easement)`;
  return listing.askingPrice ? `$${listing.askingPrice.toLocaleString()}` : "Price on Request";
}

export default function ListingsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <span className="text-[#3d6b42] text-xs font-medium uppercase tracking-widest">Available Properties</span>
        <h1 className="text-4xl font-bold mt-2 mb-3">Conservation Land Listings</h1>
        <p className="text-[#4a5e4c] max-w-xl">Each property is independently assessed across five ecological dimensions. Scores reflect conservation significance, not market value.</p>
      </div>

      {/* Filter bar placeholder */}
      <div className="flex flex-wrap gap-3 mb-10">
        {["All Provinces", "Ontario", "British Columbia", "Alberta", "Québec", "Atlantic"].map((f) => (
          <button key={f} className={`px-4 py-2 rounded-full text-sm border transition-colors ${f === "All Provinces" ? "bg-[#1a2e1c] text-white border-[#1a2e1c]" : "border-[#c8c4bb] text-[#4a5e4c] hover:border-[#3d6b42] hover:text-[#3d6b42]"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {listings.map((listing) => (
          <article key={listing.id} className="bg-white rounded-2xl border border-[#d4cfc4] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1a2e1c] to-[#2e4d30] px-6 py-5 flex justify-between items-start">
              <div>
                <p className="text-[#a8d5b0] text-xs font-medium uppercase tracking-wider">{listing.province}</p>
                <h2 className="text-white font-semibold text-lg mt-1 leading-tight">{listing.name}</h2>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {listing.tags.map((t) => (
                    <span key={t} className="bg-white/10 text-[#c8deca] text-xs px-2 py-0.5 rounded-full border border-white/10">{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-center ml-4 shrink-0">
                <div className="w-14 h-14 rounded-full bg-[#a8d5b0]/20 border-2 border-[#a8d5b0] flex items-center justify-center">
                  <span className="text-[#a8d5b0] font-bold text-lg">{listing.overallScore}</span>
                </div>
                <p className="text-[#a8bfaa] text-xs mt-1">Eco Score</p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <div className="flex gap-6 text-sm mb-4">
                <div>
                  <p className="text-[#8a9e8c] text-xs">Acreage</p>
                  <p className="font-semibold">{listing.acreage.toLocaleString()} ac</p>
                </div>
                <div>
                  <p className="text-[#8a9e8c] text-xs">
                    {listing.priceType === "sale" ? "Asking Price" : listing.priceType === "easement" ? "Easement Value" : "Structure"}
                  </p>
                  <p className="font-semibold text-[#3d6b42]">{priceLabel(listing)}</p>
                </div>
              </div>
              <p className="text-sm text-[#4a5e4c] leading-relaxed mb-5">{listing.bio}</p>

              {/* Ecological Scores */}
              <div className="border-t border-[#eceae4] pt-4 space-y-2.5">
                <p className="text-xs font-semibold text-[#8a9e8c] uppercase tracking-wider mb-3">Ecological Attributes</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-36 text-[#4a5e4c] shrink-0">Species at Risk</span>
                    <ScoreBar value={listing.ecoScore.speciesAtRisk} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-36 text-[#4a5e4c] shrink-0">Watershed Priority</span>
                    <ScoreBar value={listing.ecoScore.watershedPriority} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-36 text-[#4a5e4c] shrink-0">Connectivity</span>
                    <ScoreBar value={listing.ecoScore.connectivity} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-36 text-[#4a5e4c] shrink-0">Carbon Stock</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[#3d6b42]">{listing.ecoScore.carbonStock} tCO₂e/ha</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-36 text-[#4a5e4c] shrink-0">Wetland Class</span>
                    <p className="text-xs font-medium text-[#3d6b42]">{listing.ecoScore.wetlandClass}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button className="flex-1 bg-[#3d6b42] text-white py-2.5 rounded-full text-sm font-medium hover:bg-[#2e5233] transition-colors">
                  Request Information
                </button>
                <button className="px-4 py-2.5 border border-[#d4cfc4] rounded-full text-sm text-[#4a5e4c] hover:border-[#3d6b42] transition-colors">
                  Save
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[#4a5e4c] text-sm mb-4">Have land that belongs here?</p>
        <Link href="/sell" className="inline-block bg-[#1a2e1c] text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-[#2e4d30] transition-colors">
          Submit your property for assessment
        </Link>
      </div>
    </div>
  );
}
