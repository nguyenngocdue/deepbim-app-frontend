import { useEffect, useRef } from 'react';
import type { CredentialResponse } from 'google-one-tap';
import { useGoogleLoginHandler } from '@/hooks/useGoogleLogin';

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleLoginButton() {
  const { isLoading, handleGoogleLogin } = useGoogleLoginHandler();
  const buttonDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && buttonDivRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
          callback: (response: CredentialResponse) => {
            if (response.credential) {
              handleGoogleLogin(response);
            }
          },
          ux_mode: 'popup',
        });

        // ✅ Render Google button vào thẻ div của bạn
       window.google.accounts.id.renderButton(buttonDivRef.current, {
          theme: 'filled_blue',
          size: 'large',
          type: 'standard',
          shape: 'react',
          // text: 'signin_with',
          logo_alignment: 'left',
          locale: 'vi' // Change to Vietnamese locale to match "Đăng nhập"
        });
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client?hl=en';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }
    return () => {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) document.body.removeChild(script);
    };
  }, [handleGoogleLogin]);

  return (
    <div className="w-full h-full flex justify-center">
      <div ref={buttonDivRef} className="w-full" />
    </div>
  );
}
