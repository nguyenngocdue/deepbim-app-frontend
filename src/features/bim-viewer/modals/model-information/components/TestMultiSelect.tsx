import React, { useState } from "react";
import Select from "react-select";

const options = [
  { value: "IFCWALL", label: "IFCWALL" },
  { value: "IFCDOOR", label: "IFCDOOR" },
];

const TestMultiSelect = () => {
  const [selectedOptions, setSelectedOptions] = useState<{ value: string; label: string }[]>([]);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-lg font-semibold mb-4">Test Multi-Select Dropdown</h1>
      
      <div className="relative z-50 overflow-visible">
        <Select
          isMulti
          options={options}
          value={selectedOptions}
          onChange={(options) => setSelectedOptions(options as any)}
          placeholder="Chọn category..."
          className="text-black"
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={document.body}
        />
      </div>

      <div className="mt-6">
        <p className="text-sm">Bạn đã chọn:</p>
        <ul className="list-disc list-inside text-sky-400">
          {selectedOptions.map((opt) => (
            <li key={opt.value}>{opt.label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestMultiSelect;
