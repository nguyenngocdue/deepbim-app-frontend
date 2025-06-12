import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGoogleLoginHandler } from "@/hooks/useGoogleLoginHandler";
import { FcGoogle } from "react-icons/fc";

export function GoogleLoginButton2() {
  const { isLoading, triggerGoogleRedirect } = useGoogleLoginHandler();

  return (
    <div className="w-full flex justify-center ">
      <Button
        onClick={triggerGoogleRedirect}
        disabled={isLoading}
        className="w-full  max-w-sm flex items-center justify-center gap-2 px-4 py-2 rounded-md shadow bg-blue-400 border border-gray-300 text-gray-800 hover:bg-gray-100"
      >
        {isLoading ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <FcGoogle className="w-5 h-5" />
        )}
        <span className="text-sm font-medium whitespace-nowrap">Sign in with Google</span>
      </Button>
    </div>
  );
}
