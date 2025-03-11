import { ReactNode } from "react";

interface SolutionCardProps {
  title: string;
  description: string;
  image: string;
}

const SolutionCard = ({ title, description, image }: SolutionCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg shadow-md" />
      <h4 className="text-xl font-semibold mt-4">{title}</h4>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

export default SolutionCard;
