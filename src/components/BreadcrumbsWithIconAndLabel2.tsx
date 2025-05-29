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
import { LogoWord } from "./LogoWord";
import { useQuery } from "@tanstack/react-query";

// Define types for the entities configuration
interface EntityConfig {
  displayName: string;
  apiEndpoint: string;
}

// Define the entities and their configurations
const ENTITIES: Record<string, EntityConfig> = {
  "sub-projects": { displayName: "Sub-Projects", apiEndpoint: "sub-projects" },
  "projects": { displayName: "Projects", apiEndpoint: "projects" },
  "teams": { displayName: "Teams", apiEndpoint: "teams" },
};

// Segments to skip in the breadcrumb (optional)
const SKIP_SEGMENTS: string[] = ["managements"];

// Define the shape of the fetched entity data
interface EntityData {
  id: string;
  name: string;
}

// Define the shape of a breadcrumb item
interface BreadcrumbItemData {
  displaySegment: string;
  fullPath: string;
  isLast: boolean;
}

const BreadcrumbsWithIconAndLabel2: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const paths = pathname.split("/").filter(Boolean);

  // Find entity and ID in the URL
  const entityEntry = paths
    .map((segment: string, index: number) => {
      const entityKey = Object.keys(ENTITIES).find((key) => key === segment);
      if (entityKey && index + 1 < paths.length && !isNaN(paths[index + 1])) {
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

  // Get the authentication token (adjust based on your auth setup)
  const token = localStorage.getItem("access_token"); // Example: Retrieve token from localStorage
  // Fetch entity details by ID with authentication
  const { data: entityData, isLoading, error } = useQuery<EntityData | null, Error>({
    queryKey: ["entity", entity, id],
    queryFn: async () => {
      if (!entity || !id) {
        console.warn("No entity or ID detected:", { entity, id });
        return null;
      }
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!baseUrl) {
        console.error("VITE_API_BASE_URL is not defined in .env");
        throw new Error("API base URL is missing");
      }
      if (!token) {
        console.error("Authentication token is missing");
        throw new Error("Authentication token is missing");
      }
      const endpoint = ENTITIES[entity].apiEndpoint;
      const url = `${baseUrl}/${endpoint}/${id}`;
      console.log("Fetching from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add Bearer token to headers
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch ${entity} with ID ${id}: ${errorText}`);
      }
      const {data} = await response.json();
      return data; // Expect { id: "1", name: "Sub-Project A" }
    },
    enabled: !!entity && !!id && !!token, // Only fetch if entity, ID, and token are present
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Retry once on failure
  });


  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItemData[] = paths
    .map((segment: string, index: number) => {
      const fullPath = "/" + paths.slice(0, index + 1).join("/");
      const isLast = index === paths.length - 1;

      // Skip irrelevant segments
      if (SKIP_SEGMENTS.includes(segment)) return null;

      // Skip the ID segment (we'll replace it with the name)
      if (entityEntry && index === entityEntry.idIndex) return null;

      // Resolve segment
      let displaySegment = decodeURIComponent(segment);

      // Format known entities
      if (ENTITIES[segment]) {
        displaySegment = ENTITIES[segment].displayName;
      }

      // Replace the entity segment with the fetched name
      if (entityEntry && index === entityEntry.entityIndex) {
        if (isLoading) {
          displaySegment = "Loading...";
        } else if (error) {
          displaySegment = `Unknown ${ENTITIES[entity].displayName.slice(0, -1)}`; // e.g., "Unknown Sub-Project"
          console.error("Error fetching entity:", error.message);
        } else if (!entityData) {
          displaySegment = `Unknown ${ENTITIES[entity].displayName.slice(0, -1)}`;
        } else {
          displaySegment = entityData.name; // Use the fetched name
        }
      }

      // Format other segments (e.g., "data" → "Data")
      if (segment === "data") {
        displaySegment = "Data";
      } else if (segment === "members") {
        displaySegment = "Members";
      } else if (segment === "details") {
        displaySegment = "Details";
      }

      return {
        displaySegment,
        fullPath,
        isLast,
      };
    })
    .filter(Boolean) as BreadcrumbItemData[]; // Remove null entries

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center space-x-2">
        {/* Home */}
        <BreadcrumbItem>
          <LogoWord isHiddenText={true} size="sm" path="/images/logo_no_bg.png" />
        </BreadcrumbItem>

        {/* Dynamic Breadcrumb Items */}
        {breadcrumbItems.map((item) => (
          <div key={item.fullPath} className="flex items-center">
            <BreadcrumbSeparator>
              <ChevronsRight className="h-4 w-4 text-muted-foreground" />
            </BreadcrumbSeparator>

            {item.isLast ? (
              <BreadcrumbPage className="capitalize text-sm font-medium">
                {item.displaySegment}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbLink href={item.fullPath} className="capitalize text-sm font-medium hover:text-primary">
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