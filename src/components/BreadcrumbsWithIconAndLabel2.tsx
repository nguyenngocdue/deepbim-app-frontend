// Updated BreadcrumbsWithIconAndLabel2.tsx with icons per segment
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronsRight } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { AppIcons } from "./icons";

interface EntityConfig {
  displayName: string;
  apiEndpoint: string;
}

const ENTITIES: Record<string, EntityConfig> = {
  "sub-projects": { displayName: "Sub-Projects", apiEndpoint: "sub-projects" },
  "projects": { displayName: "Projects", apiEndpoint: "projects" },
  "teams": { displayName: "Teams", apiEndpoint: "teams" },
};

const SKIP_SEGMENTS: string[] = ["managements"];

interface EntityData {
  id: string;
  name: string;
}

interface BreadcrumbItemData {
  displaySegment: string;
  fullPath: string;
  isLast: boolean;
  icon?: JSX.Element;
}

const BreadcrumbsWithIconAndLabel2: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const paths = pathname.split("/").filter(Boolean);

  const entityEntry = paths
    .map((segment, index) => {
      const entityKey = Object.keys(ENTITIES).find((key) => key === segment);
      if (entityKey && index + 1 < paths.length && !isNaN(Number(paths[index + 1]))) {
        return {
          entity: entityKey,
          id: paths[index + 1],
          entityIndex: index,
          idIndex: index + 1,
        };
      }
      return null;
    })
    .filter(Boolean)[0] as { entity: string; id: string; entityIndex: number; idIndex: number } | undefined;

  const entity = entityEntry?.entity;
  const id = entityEntry?.id;
  const token = localStorage.getItem("access_token");

  const { data: entityData, isLoading, error } = useQuery<EntityData | null, Error>({
    queryKey: ["entity", entity, id],
    queryFn: async () => {
      if (!entity || !id || !token) return null;
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const endpoint = ENTITIES[entity].apiEndpoint;
      const url = `${baseUrl}/${endpoint}/${id}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const { data } = await response.json();
      return data;
    },
    enabled: !!entity && !!id && !!token,
    staleTime: 5 * 60 * 1000,
  });

  const breadcrumbItems: BreadcrumbItemData[] = paths
    .map((segment, index) => {
      const fullPath = "/" + paths.slice(0, index + 1).join("/");
      const isLast = index === paths.length - 1;
      if (SKIP_SEGMENTS.includes(segment)) return null;
      if (entityEntry && index === entityEntry.idIndex) return null;

      let displaySegment = decodeURIComponent(segment);
      let icon: JSX.Element | undefined = undefined;

      if (ENTITIES[segment]) {
        displaySegment = ENTITIES[segment].displayName;
        if (segment === "projects") icon = <AppIcons.Projects className="mr-1" />;
        if (segment === "sub-projects") icon = <AppIcons.SubProjects className="mr-1" />;
        if (segment === "teams") icon = <AppIcons.Workspaces className="mr-1" />;
      }

      if (entityEntry && index === entityEntry.entityIndex) {
        displaySegment = isLoading
          ? "Loading..."
          : error || !entityData
          ? `Unknown ${ENTITIES[entity].displayName.slice(0, -1)}`
          : entityData.name;
      }

      if (segment === "data") {
        displaySegment = "Data";
        icon = <AppIcons.BoxModel className="mr-1" />;
      }
      if (segment === "members") displaySegment = "Members";
      if (segment === "details") displaySegment = "Details";

      return {
        displaySegment,
        fullPath,
        isLast,
        icon,
      };
    })
    .filter(Boolean) as BreadcrumbItemData[];

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg shadow-md">
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="hover:text-primary transition-all">
            <AppIcons.Home className="w-5 h-5 text-muted-foreground" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map((item) => (
          <div key={item.fullPath} className="flex items-center">
            <BreadcrumbSeparator>
              <ChevronsRight className="h-4 w-4 text-muted-foreground" />
            </BreadcrumbSeparator>

            {item.isLast ? (
              <BreadcrumbPage className="capitalize text-sm font-semibold text-foreground flex items-center">
                {item.icon}
                {item.displaySegment}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={item.fullPath}
                  className={clsx(
                    "capitalize text-sm font-medium transition-colors flex items-center",
                    "hover:text-primary hover:underline underline-offset-4"
                  )}
                >
                  {item.icon}
                  {item.displaySegment}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbsWithIconAndLabel2;
