import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TreeNode {
  name: string;
  value?: string;
  children?: TreeNode[];
}

export const TreeAccordion: React.FC<{ data: TreeNode[] }> = ({ data }) => {
  return (
    <Accordion type="multiple" className="w-full">
      {data.map((node, index) => (
        <TreeItem node={node} key={index} parentKey={`node-${index}`} />
      ))}
    </Accordion>
  );
};

const TreeItem: React.FC<{ node: TreeNode; parentKey: string }> = ({ node, parentKey }) => {
  const id = `${parentKey}-${node.name}`;

  if (node.children && node.children.length > 0) {
    return (
      <AccordionItem value={id}>
        <AccordionTrigger>{node.name}</AccordionTrigger>
        <AccordionContent>
          <Accordion type="multiple" className="pl-4">
            {node.children.map((child, idx) => (
              <TreeItem node={child} key={idx} parentKey={`${id}-${idx}`} />
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    );
  }

  // Nếu là node cuối, hiển thị name + value nếu có
  return (
    <div className="pl-6 py-1 text-sm text-muted-foreground">
      <span className="font-medium">{node.name}</span>
      {node.value && `: ${node.value}`}
    </div>
  );
};
