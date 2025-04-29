import { Heading } from "@/components/common/Heading";

export function TableToolbar({ total }: { total: number }) {
  return (
    <Heading level={6} className="px-4 pt-2 text-150 italic" position="right">
      (Total item: {total})
    </Heading>
  );
}
