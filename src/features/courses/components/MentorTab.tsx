import { Card, CardContent } from "@/components/ui/card";

interface MentorTabProps {
  name: string;
  avatar: string;
  bio?: string;
}

export default function MentorTab({ name, avatar, bio }: MentorTabProps) {
  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6 text-center text-gray-900 dark:text-gray-100">
        <img
          src={avatar}
          alt={name}
          className="w-36 h-36 mx-auto rounded-full object-cover border-4 border-blue-500 dark:border-emerald-400 shadow-sm mb-5 transition-transform duration-300 hover:scale-102"
        />
        <h3 className="text-2xl font-extrabold text-blue-600 dark:text-emerald-400 mb-3 font-smooth">
          {name}
        </h3>
        <p className="text-base text-gray-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-sm transition-all duration-300 hover:bg-blue-50 dark:hover:bg-gray-700">
          {bio || "Mentor giàu kinh nghiệm, luôn đồng hành cùng bạn trong quá trình học."}
        </p>
        <a
          href={`/user/show/profile-owner`}
          aria-label={`Xem hồ sơ của ${name}`}
          target="blank"
          className="mt-4 inline-block px-6 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 hover:scale-105"
        >
          Xem Profile
        </a>
      </CardContent>
    </Card>
  );
}