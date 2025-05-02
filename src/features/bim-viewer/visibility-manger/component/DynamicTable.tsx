import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface DynamicTableProps {
  categories: string[];
  categoryColors: Record<string, string>;
  categoryTransparencies: Record<string, number>;
  checkedCategories: string[];
  onOpenColorPicker: (category: string) => void;
  onOpenTransparencyPicker: (category: string) => void;
  onCheckboxChange: (category: string, checked: boolean) => void;
  resetRow: (category: string) => void;
  onCheckAllChange: (checked: boolean) => void;

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
  onCheckAllChange
}: DynamicTableProps) {
  const [selected, setSelected] = useState<string[]>([]);


  return (
    <>
      <div className="relative max-h-[330px] overflow-auto rounded-lg border border-slate-700 shadow-md shadow-zinc-700">
        <Table>
          <TableHeader>
            {/* Dòng 1 */}
            <TableRow className="sticky top-0 z-20 bg-slate-950 text-slate-100 border-b border-slate-700 shadow-sm">
              <TableHead
                className="w-12   text-center sticky top-0 bg-slate-950 z-20"
                rowSpan={2}
              />
              <TableHead
                className=" w-4 font-semibold sticky top-0 bg-slate-950 z-20"
                rowSpan={2}
              >
                Visibility
              </TableHead>
              <TableHead
                className="text-center   font-semibold sticky top-0 bg-slate-950 z-20"
                colSpan={3}
              >
                Projection / Surface
              </TableHead>
            </TableRow>

            {/* Dòng 2 */}
            <TableRow className=" z-10 bg-slate-800 text-slate-300 border-b border-slate-700 shadow-sm">
              <TableHead className="  text-center font-medium  bg-slate-800 z-10">
                Color
              </TableHead>
              <TableHead className="  text-center font-medium  bg-slate-800 z-10">
                Transparent
              </TableHead>
              <TableHead className="  text-center font-medium  bg-slate-800 z-10">
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
                  className="hover:bg-slate-800/40 transition-colors duration-150 border-0"
                  onClick={() => {
                    setSelected((prev) =>
                      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                    );
                  }}
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={checkedCategories.includes(cat)}
                      onCheckedChange={(checked) =>
                        onCheckboxChange(cat, Boolean(checked))
                      }
                      className="border-slate-600 bg-slate-800 text-white 
                           data-[state=checked]:bg-green-600 
                           data-[state=checked]:border-green-600 
                           data-[state=checked]:text-white 
                           hover:border-slate-500 transition-colors"
                      aria-label={`Toggle visibility for ${cat}`}
                    />
                  </TableCell>
                  <TableCell className="text-slate-100 font-medium whitespace-nowrap">
                    {cat}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      style={{
                        backgroundColor: color ,
                        color: color ? "transparent" : "",
                        boxShadow: color ? "0 0 8px rgba(0,0,0,0.3)" : "none",
                      }}
                      className="w-28 rounded-md border transition-all hover-button"
                      onClick={() => onOpenColorPicker(cat)}
                      aria-label={`Override color for ${cat}`}
                    >
                      {!color && "Override"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-28 rounded-md border transition-all hover-button"
                      onClick={() => onOpenTransparencyPicker(cat)}
                      aria-label={`Set transparency for ${cat}`}
                    >
                      {transparency != null && !Number.isNaN(transparency)
                        ? `${transparency}%`
                        : `Override`}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      className=" hover-button"
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

      <div className="flex items-center gap-3 px-4 py-3 ">
        <Checkbox
          checked={checkedCategories.length === categories.length}
          indeterminate={
            checkedCategories.length > 0 &&
            checkedCategories.length < categories.length
          }
          onCheckedChange={(checked) => {
            onCheckAllChange(Boolean(checked)); // ✅ gọi hàm thực sự cập nhật state cha
          }}
          className="border-slate-600 bg-slate-800 text-white 
       data-[state=checked]:bg-green-600 
       data-[state=checked]:border-green-600 
       data-[state=checked]:text-white 
       hover:border-slate-500"
          aria-label="Toggle all categories"
        />

        <label className="text-slate-300 text-sm font-medium select-none">
          {checkedCategories.length === categories.length
            ? "Uncheck all"
            : "Check all"}
        </label>
      </div>

    </>
  );
}