function getInitial(name = "") {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

const BG_COLORS = [
  "bg-orange-500",
  "bg-green-400",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-400",
  "bg-yellow-400",
];

interface Member {
  name: string;
  picture?: string;
}

interface AvatarGroupProps {
  members: Member[];
  size?: number;
  overlap?: number;
  maxDisplay?: number; // Cho phép truyền số tối đa avatar hiện ra (default 5)
}

export function AvatarGroup({ members, size = 32, overlap = -12, maxDisplay = 5 }: AvatarGroupProps) {
  const displayMembers = members.slice(0, maxDisplay);
  const hiddenCount = members.length - maxDisplay;

  return (
    <div className="flex items-center">
      {displayMembers.map((m, idx) => {
        // Tạo màu nền random dựa trên vị trí
        const bg = BG_COLORS[idx % BG_COLORS.length];
        return (
          <div
            key={idx}
            className={`rounded-full border-2 border-white flex items-center justify-center overflow-hidden`}
            style={{
              width: size,
              height: size,
              marginLeft: idx === 0 ? 0 : overlap,
              background: m.picture ? "transparent" : undefined,
            }}
          >
            {m.picture ? (
              <img
                src={m.picture}
                alt={m.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className={`text-white text-base font-bold ${bg} w-full h-full flex items-center justify-center`}>
                {getInitial(m.name)}
              </span>
            )}
          </div>
        );
      })}

      {hiddenCount > 0 && (
        <div
          className={`rounded-full border-2 border-white flex items-center justify-center bg-gray-400 text-white font-semibold`}
          style={{
            width: size,
            height: size,
            marginLeft: overlap,
            fontSize: size / 2,
          }}
          title={`${hiddenCount} more`}
        >
          +{hiddenCount}
        </div>
      )}
    </div>
  );
}
