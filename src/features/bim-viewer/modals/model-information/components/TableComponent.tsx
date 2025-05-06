// TableComponent.tsx
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

interface TableProps {
  columns: string[]; // Column headers
  dataSource: Record<string, any>[]; // Data for the table rows
}

const TableComponent: React.FC<TableProps> = ({ columns, dataSource }) => {
  return (
    <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-lg ml-0">
      <Table className="min-w-full table-auto text-gray-700">
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} className="px-4 py-2 text-left font-semibold text-gray-900 bg-blue-200">
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataSource.length > 0 ? (
            dataSource.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="border-b hover:bg-blue-50">
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className="px-4 py-2 text-left">
                    {row[column] !== undefined && row[column] !== null ? row[column] : 'N/A'}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-gray-500">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
