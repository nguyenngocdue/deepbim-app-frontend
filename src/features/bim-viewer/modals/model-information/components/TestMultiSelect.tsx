import React, { useState } from "react";

const TestMultiSelect = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSelected(selectedOptions);
  };

  return (
    <div className="p-4">
      <label className="block mb-2 text-sm font-medium text-white">
        Chọn nhiều category (HTML thuần)
      </label>
      <select
        multiple
        onChange={handleChange}
        className="w-full h-40 bg-slate-800 text-white border border-slate-600 rounded p-2"
      >
        <option value="IFCWALL">IFCWALL</option>
        <option value="IFCDOOR">IFCDOOR</option>
        <option value="IFCWINDOW">IFCWINDOW</option>
        <option value="IFCFLOOR">IFCFLOOR</option>
        <option value="IFCSTAIR">IFCSTAIR</option>
      </select>

      <div className="mt-4 text-white">
        <strong>Đã chọn:</strong>
        <ul className="list-disc ml-5 mt-1 text-cyan-400">
          {selected.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestMultiSelect;
