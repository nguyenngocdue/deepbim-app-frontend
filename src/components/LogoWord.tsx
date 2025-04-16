interface LogoWordProps {
  isHiddenText?: boolean; // Make sure it is optional & boolean
}

export const LogoWord = ({ isHiddenText = false }: LogoWordProps) => {
  return (
    <div className="flex text-center items-center">
      <img src="/images/logo.png" className="h-12 w-12" alt="Logo" />
      <h1 className={`text-xl font-bold text-green-600 ${isHiddenText ? "hidden" : ""}`}>
        <a href="/"  className="px-2">DeepBIM</a>  
      </h1>
    </div>
  );
};
