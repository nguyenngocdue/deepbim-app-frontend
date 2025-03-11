import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  image: string;
}

const FeatureCard = ({ icon, title, description, image }: FeatureCardProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 py-10">
      <div className="md:w-1/2 text-left">
        <div className="flex items-center gap-4">
          <div className="text-green-500 text-5xl">{icon}</div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <p className="mt-4 text-gray-600">{description}</p>
      </div>
      <div className="md:w-1/2">
        <img src={image} alt={title} className="w-full shadow-lg rounded-lg" />
      </div>
    </div>
  );
};

export default FeatureCard;
