import { IconBrandGithub } from '@tabler/icons-react';
import AppButton from './bim-viewer/common/AppButton';
import { Loader2 } from 'lucide-react';

interface GitHubLoginButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export function GitHubLoginButton({ isLoading, onClick }: GitHubLoginButtonProps) {
  return (

    <AppButton
      isLoading={isLoading}
      onClick={onClick}
      trueName="Signing in..."
      falseName="GitHub"
      loadingIcon={<Loader2 className="w-4 h-4 animate-spin" />}
      defaultIcon={<IconBrandGithub className="h-4 w-4 mr-2" />}
      className="w-full border-slate-600 bg-[#161B22] text-slate-100"
    />

  );
}
