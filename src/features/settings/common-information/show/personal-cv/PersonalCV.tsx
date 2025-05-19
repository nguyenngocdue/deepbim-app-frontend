import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const data = {
  avatar: "/avatars/female-01.png",
  name: "Jill Anderson",
  job: "UI Designer",
  quote: "I'm looking for a site that will simplify the planning of my business trips.",
  bio:
    "Jill is a Regional Director who travels 4-8 times each month for work. She has a specific region in which she travels, and she often visits the same cities and stays at the same hotel. She is frustrated by the fact that no matter how frequently she takes similar trips, she spends hours of her day booking travel. She expects her travel solutions to be as organized as she is.",
  age: 26,
  status: "Single",
  location: "Brooklyn",
  archetype: "Frequent Flyer",
  traits: ["Organized", "Protective", "Practical", "Hardworking", "Passionate", "Punctual"],
  motivations: [
    { name: "Price", value: 60 },
    { name: "Comfort", value: 85 },
    { name: "Convenience", value: 45 },
    { name: "Speed", value: 70 },
    { name: "Loyalty/Miles", value: 90 },
  ],
  personality: [
    { name: "Introvert", value: 10, max: 100, end: "Extrovert" },
    { name: "Analytical", value: 30, max: 100, end: "Creative" },
    { name: "Loyal", value: 70, max: 100, end: "Fickle" },
    { name: "Passive", value: 20, max: 100, end: "Active" },
  ],
  goals: [
    "To spend less time booking travel",
    "To narrow her options quickly",
  ],
  frustrations: [
    "Too much time spent booking – she's busy!",
    "Too many websites visited per trip",
    "Not terribly tech savvy – doesn't like the process",
  ],
  brands: [
    "/brands/adidas.svg",
    "/brands/nike.svg",
    "/brands/netflix.svg",
    "/brands/airbnb.svg",
    "/brands/zara.svg",
  ],
};

export default function PersonaCV() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090a1a] px-2 py-10">
      {/* Card wrapper */}
      <div className="relative max-w-5xl w-full bg-[#fdf6f2] rounded-3xl shadow-2xl p-12 flex flex-col gap-8">
        {/* Emoji plane or hand */}
        <span className="absolute left-[-45px] top-24 text-[60px] select-none">✌️</span>
        {/* Plane illustration (fake) */}
        <div className="absolute right-[-75px] bottom-[-20px] hidden md:block select-none pointer-events-none" style={{zIndex:0}}>
          <img src="/plane.png" alt="plane" width={160} height={90} />
        </div>
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {/* Left block */}
          <div className="col-span-1 flex flex-col items-center gap-4">
            <Avatar className="w-28 h-28 border-4 border-white shadow-lg mb-2">
              <AvatarImage src={data.avatar} alt={data.name} />
            </Avatar>
            <div className="text-2xl font-bold text-zinc-900">{data.name}</div>
            <div className="text-lg text-red-500 font-semibold mb-2">{data.job}</div>
            <div className="italic text-zinc-500 text-center flex flex-col items-center">
              <span className="text-2xl text-amber-400 mb-1">“</span>
              <span className="mb-2">{data.quote}</span>
            </div>
            {/* Quick stats */}
            <div className="flex flex-col gap-1 w-full mt-2">
              <StatLine label="Age" value={data.age} />
              <StatLine label="Status" value={data.status} />
              <StatLine label="Location" value={data.location} />
              <StatLine label="Archetype" value={data.archetype} />
            </div>
            {/* Traits/Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {data.traits.map((t) => (
                <Badge key={t} className="bg-red-100 text-red-600 font-semibold rounded-xl text-sm px-3 py-1 shadow-none">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          {/* Middle/Right grid blocks */}
          <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bio */}
            <div className="bg-[#fdf6f2] rounded-xl p-6 flex flex-col">
              <div className="font-bold text-zinc-800 mb-1">Bio</div>
              <div className="text-zinc-600 text-sm">{data.bio}</div>
            </div>
            {/* Motivations + Frustrations */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#fdf6f2] rounded-xl p-6">
                <div className="font-bold text-zinc-800 mb-2">Motivations</div>
                <div className="flex flex-col gap-3">
                  {data.motivations.map((m) => (
                    <BarLine key={m.name} label={m.name} value={m.value} />
                  ))}
                </div>
              </div>
              <div className="bg-[#fdf6f2] rounded-xl p-6">
                <div className="font-bold text-zinc-800 mb-2">Frustrations</div>
                <ul className="list-disc ml-5 text-red-500 text-sm space-y-1">
                  {data.frustrations.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Personality + Goals + Brands */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#fdf6f2] rounded-xl p-6">
                <div className="font-bold text-zinc-800 mb-2">Personality</div>
                <div className="space-y-3">
                  {data.personality.map((p) => (
                    <PersonalityBar key={p.name} {...p} />
                  ))}
                </div>
              </div>
              <div className="bg-[#fdf6f2] rounded-xl p-6">
                <div className="font-bold text-zinc-800 mb-2">Goals</div>
                <ul className="list-disc ml-5 text-red-500 text-sm space-y-1">
                  {data.goals.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#fdf6f2] rounded-xl p-6">
                <div className="font-bold text-zinc-800 mb-2">Favourite Brands</div>
                <div className="flex flex-wrap items-center gap-4">
                  {data.brands.map((b, i) => (
                    <img
                      key={i}
                      src={b}
                      alt="brand"
                      className="h-8 grayscale contrast-150 opacity-90"
                      style={{ maxWidth: 70 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat line
function StatLine({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-xs bg-red-50 rounded px-3 py-1 mb-1 w-full">
      <span className="font-semibold text-zinc-700">{label}:</span>
      <span className="text-zinc-900">{value}</span>
    </div>
  );
}

// Horizontal bar line
function BarLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-xs font-medium text-zinc-600">
        <span>{label}</span>
        <span className="text-red-600">{value}</span>
      </div>
      <div className="w-full h-2 bg-red-100 rounded-full">
        <div
          className="h-2 bg-red-600 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// Personality bar with endpoints
function PersonalityBar({
  name,
  value,
  max = 100,
  end,
}: {
  name: string;
  value: number;
  max?: number;
  end?: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
        <span>{name}</span>
        {end && <span>{end}</span>}
      </div>
      <div className="w-full h-2 bg-red-100 rounded-full">
        <div
          className="h-2 bg-red-500 rounded-full"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}
