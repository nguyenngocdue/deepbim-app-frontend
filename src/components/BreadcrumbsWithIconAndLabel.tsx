import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronsRight, Home } from "lucide-react";
import { useLocation } from '@tanstack/react-router'; // ✅ Dùng useLocation

const BreadcrumbsWithIconAndLabel = () => {
  const location = useLocation(); // ✅ lấy location đúng chuẩn
  const pathname = location.pathname;
  const paths = pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamic Segments */}
        {paths.map((segment, index) => {
          const fullPath = '/' + paths.slice(0, index + 1).join('/');
          const isLast = index === paths.length - 1;

          return (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronsRight className="h-4 w-4" />
              </BreadcrumbSeparator>

              {isLast ? (
                <BreadcrumbPage className="capitalize ">
                  <span className="text-subtitle2">{decodeURIComponent(segment)}</span>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink href={fullPath} className="capitalize text-subtitle2">
                  <span className="text-subtitle2">{decodeURIComponent(segment)}</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbsWithIconAndLabel;
