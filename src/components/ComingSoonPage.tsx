import { PromptCard } from "@/features/learning/lessons-for-newbie/components/PromptCard";
import AppButton2 from "./bim-viewer/common/AppButton2";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <PromptCard
        title="This page is under development"
        description="We're currently building this page, and it's not yet available in the production environment. We hope to release it soon so you can explore it. Thank you sincerely for stopping by!"
        imageUrl="https://minio.deepbim.net:9000/deepbim-fe/1750148947906-coming_soon.gif"
        action={
          <AppButton2
            btnType="back"
            variant="outline"
            className="rounded-full text-sm px-4 py-2 hover:bg-primary hover:text-white transition"
            onClick={() => window.location.href = "/"}
          />
        }
      />
    </div>
  );
}
