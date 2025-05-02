import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DynamicTableProps {
  categories: string[];
  categoryColors: Record<string, string>;
  categoryTransparencies: Record<string, number>;
  checkedCategories: string[];
  onOpenColorPicker: (category: string) => void;
  onOpenTransparencyPicker: (category: string) => void;
  onCheckboxChange: (category: string, checked: boolean) => void;
  resetRow: (category: string) => void;
}

export function DynamicTable({
  categories,
  categoryColors,
  categoryTransparencies,
  checkedCategories,
  onOpenColorPicker,
  onOpenTransparencyPicker,
  onCheckboxChange,
  resetRow,
}: DynamicTableProps) {


  
  return (
    <>
      <div className="relative overflow-y-auto rounded-lg border border-slate-800 shadow-lg bg-slate-900 max-h-[500px]">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-slate-800 text-slate-100 border-b border-slate-700">
              <TableHead
                className="w-12 px-4 py-3 sticky top-0 bg-slate-800 z-10"
                rowSpan={2}
              ></TableHead>
              <TableHead
                className="px-6 py-3 font-semibold sticky top-0 bg-slate-800 z-10"
                rowSpan={2}
              >
                Visibility
              </TableHead>
              <TableHead
                className="text-center px-6 py-3 font-semibold sticky top-0 bg-slate-800 z-10"
                colSpan={3}
              >
                Projection / Surface
              </TableHead>
            </TableRow>
            <TableRow className="bg-slate-700 text-slate-300 border-b border-slate-700">
              <TableHead
                className="px-6 py-2 text-center font-medium sticky top-[48px] bg-slate-700 z-10"
              >
                Color
              </TableHead>
              <TableHead
                className="px-6 py-2 text-center font-medium sticky top-[48px] bg-slate-700 z-10"
              >
                Transparent
              </TableHead>
              <TableHead
                className="px-6 py-2 text-center font-medium sticky top-[48px] bg-slate-700 z-10"
              >
                Reset
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat, idx) => {
              const color = categoryColors[cat];
              const transparency = categoryTransparencies[cat];
              return (
                <TableRow
                  key={idx}
                  className="hover:bg-slate-800/50 transition-colors duration-200"
                >
                  <TableCell className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={checkedCategories.includes(cat)}
                      onChange={(e) => onCheckboxChange(cat, e.target.checked)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-600"
                      aria-label={`Toggle visibility for ${cat}`}
                    />
                  </TableCell>
                  <TableCell className="text-slate-100 font-medium px-6 py-3 whitespace-nowrap">
                    {cat}
                  </TableCell>
                  <TableCell className="text-center px-6 py-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      style={{
                        backgroundColor: color || "#334155",
                        color: color ? "transparent" : "#F1F5F9",
                        boxShadow: color ? "0 0 8px rgba(0,0,0,0.2)" : "none",
                      }}
                      className="w-28 rounded-lg border border-slate-600/50 hover:opacity-80 transition-all duration-200"
                      onClick={() => onOpenColorPicker(cat)}
                      aria-label={`Override color for ${cat}`}
                    >
                      {!color && "Override"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center px-6 py-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-28 rounded-lg border border-slate-600/50 hover:opacity-80 transition-all duration-200 text-slate-300"
                      onClick={() => onOpenTransparencyPicker(cat)}
                      aria-label={`Set transparency for ${cat}`}
                    >
                      {transparency !== undefined ? `${transparency}%` : `Override`}
                    </Button>
                  </TableCell>

                  <TableCell className="text-center px-6 py-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-red-500"
                    onClick={() => resetRow(cat)}
                  >
                    Reset
                  </Button>
                </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center gap-3 p-4  ">
        <input
          type="checkbox"
          checked={checkedCategories.length === categories.length}
          onChange={(e) => {
            const checked = e.target.checked;
            categories.forEach((cat) => onCheckboxChange(cat, checked));
          }}
          className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-600"
          aria-label="Toggle all categories"
        />
        <label className="text-slate-300 text-sm font-medium">
          {checkedCategories.length === categories.length ? "Uncheck all" : "Check all"}
        </label>
      </div>
    </>
  );
}