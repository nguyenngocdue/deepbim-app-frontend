import { AuthCallback2 } from "@/components/auth/AuthCallback2";
import { PurchasePage } from "@/features/tutorials/purchases/PurchasePage";
import { createFileRoute, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tutorials/_layout/purchase-course")({
  component: RouteComponent,
});

function RouteComponent() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("course_id");
    const title = searchParams.get("title");


  if (!id) {
    return <AuthCallback2/>;
  }

  return <>
    <PurchasePage courseId={Number(id)} title={title || ""}/>
  </>
}
