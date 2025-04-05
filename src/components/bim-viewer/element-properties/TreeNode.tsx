import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PropertyNode {
  data: {
    Entity: string;
    Name?: string;
    modelID: string;
    expressID: number;
  };
  children?: PropertyNode[];
}

interface TreeNodeProps {
  node: PropertyNode;
  level?: number;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node, level = 0 }) => {
  const [open, setOpen] = useState(true);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="ml-4">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-left w-full px-2 py-1 text-sm"
        >
          {hasChildren && (
            <span>{open ? "▼" : "▶"}</span>
          )}
          <span className="font-medium">
            [{node.data.Entity}] {node.data.Name || "Unnamed"} (#{node.data.expressID})
          </span>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pl-4 border-l border-muted">
        {hasChildren &&
          node.children!.map((child, i) => (
            <TreeNode key={i} node={child} level={level + 1} />
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
