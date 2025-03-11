import { ReactNode } from "react";

interface ProblemCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}

const ProblemCard = ({ icon, title, description, color }: ProblemCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
      <div className={`text-5xl ${color}`}>{icon}</div>
      <h4 className="text-xl font-semibold mt-4">{title}</h4>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

export default ProblemCard;
