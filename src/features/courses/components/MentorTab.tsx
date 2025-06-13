import { Card, CardContent } from "@/components/ui/card";

interface MentorTabProps {
  name: string;
  avatar: string;
  bio?: string;
}

export default function MentorTab({ name, avatar, bio }: MentorTabProps) {
  return (
    <Card className="bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-gray-900/80 border border-gray-700/40 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
      <CardContent className="p-6 text-center text-white">
        <img
          src={avatar}
          alt={name}
          className="w-36 h-36 mx-auto rounded-full object-cover border-4 border-emerald-500/50 shadow-lg mb-5 transition-transform duration-300 hover:scale-110"
        />
        <h3 className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text mb-3">
          {name}
        </h3>
        <p className="text-base text-gray-200 max-w-md mx-auto leading-relaxed bg-gray-800/60 p-3 rounded-lg shadow-inner transition-opacity duration-300 hover:opacity-95">
          {bio || "Mentor giàu kinh nghiệm, luôn đồng hành cùng bạn trong quá trình học."}
        </p>
      </CardContent>
    </Card>
  );
}