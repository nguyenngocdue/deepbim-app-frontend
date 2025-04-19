interface LogoWordProps {
  isHiddenText?: boolean; // Make sure it is optional & boolean
}

export const LogoWord = ({ isHiddenText = false }: LogoWordProps) => {
  return (
    <a href="/">
      <div className="flex text-center items-center">
        <img src="/images/logo.png" className="h-12 w-12" alt="Logo" />
        <h1 className={`text-xl font-bold text-green-600 ${isHiddenText ? "hidden" : ""}`}>
          <span  className="px-2">DeepBIM</span>  
        </h1>
      </div>
    </a>
  );
};
