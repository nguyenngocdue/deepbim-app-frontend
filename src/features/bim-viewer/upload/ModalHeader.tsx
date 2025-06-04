interface ModalHeaderProps {
  title: string;
  subtitle?: string;
}

export const ModalHeader = ({ title, subtitle }: ModalHeaderProps) => {
  return (
    <div className="">
      <h3 className="text-xl sm:text-2xl xl:text-3xl font-bold text-center">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-1 text-md sm:text-xl text-center max-w-sm mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};