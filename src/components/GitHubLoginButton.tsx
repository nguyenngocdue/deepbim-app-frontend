import { Button } from '@/components/ui/button';
import { IconBrandGithub } from '@tabler/icons-react';

interface GitHubLoginButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export function GitHubLoginButton({ isLoading, onClick }: GitHubLoginButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full border-slate-600 bg-[#161B22] text-slate-100"
      type="button"
      disabled={isLoading}
      onClick={onClick}
    >
      <IconBrandGithub className="h-4 w-4 mr-2" />
      {isLoading ? 'Signing in...' : 'GitHub'}
    </Button>
  );
}
