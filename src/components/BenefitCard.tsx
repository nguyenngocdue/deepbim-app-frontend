import { ReactNode } from "react";

interface BenefitCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
      <div className="text-4xl text-green-500">{icon}</div>
      <h4 className="text-xl font-semibold mt-4">{title}</h4>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

export default BenefitCard;
