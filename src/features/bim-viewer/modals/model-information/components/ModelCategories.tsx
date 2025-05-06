import React, { useEffect, useState } from "react";
import Select from "react-select";
import { defaultCategories } from "../../visibility-manger/component/defaults";
import CategoryChart from "./CategoryChart";

interface Attribute {
  type?: string;
  value: string | number;
}

interface Model {
  getItemsData: (
    localIds: number[],
    options: { attributesDefault: boolean; attributes?: string[] }
  ) => Promise<Record<string, Attribute>[]>;
  getItemsOfCategory: (category: string) => Promise<any[]>;
}

interface Content {
  localId: number;
  fragments: Model;
}

interface CategoryResult {
  category: string;
  names: string[];
  rawData: Record<string, Attribute>[];
}

const getNamesFromCategory = async (
  model: Model,
  category: string,
  unique = false
): Promise<CategoryResult> => {
  const items = await model.getItemsOfCategory(category);
  const localIds = (
    await Promise.all(items.map((item) => item.getLocalId?.()))
  ).filter((id): id is number => id !== null && id !== undefined);

  const dataList = await model.getItemsData(localIds, {
    attributesDefault: false,
    attributes: ["Name"],
  });

  const names = dataList
    .map((data) => {
      const nameAttr = data["Name"];
      return typeof nameAttr?.value === "string" ? nameAttr.value : null;
    })
    .filter((name): name is string => !!name);

  return {
    category,
    names: unique ? Array.from(new Set(names)) : names,
    rawData: dataList,
  };
};

const ModelCategories: React.FC<{ content: Content }> = ({ content }) => {
  const [selectedCategories, setSelectedCategories] = useState<{ value: string; label: string }[]>([]);
  const [data, setData] = useState<CategoryResult[]>([]);

  const categoryOptions = defaultCategories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  useEffect(() => {
    if (!content || selectedCategories.length === 0) return;

    const fetch = async () => {
      const { fragments } = content;
      const results = await Promise.all(
        selectedCategories.map((cate) =>
          getNamesFromCategory(fragments, cate.value, true)
        )
      );
      setData(results);
    };

    fetch();
  }, [selectedCategories, content]);

  const chartData = data.map((d) => ({
    category: d.category,
    count: d.names.length,
  }));

  return (
    <div className="w-full p-4 h-full bg-slate-400">
      <label className="block mb-2 text-sm font-medium text-white">
        Chọn Category
      </label>
      <div className="relative z-50">
        <Select
          isMulti
          options={categoryOptions}
          value={selectedCategories}
          onChange={(options) => {
            setSelectedCategories(options as { value: string; label: string }[]);
          }}
          placeholder="Chọn một hoặc nhiều category"
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          className="text-black mb-4"
        />
      </div>

      {chartData.length > 0 ? (
        <div className="min-w-[700px] w-full max-w-full">
          <CategoryChart data={chartData} />
        </div>
      ) : (
        <p className="text-slate-400 italic">Chưa có dữ liệu để hiển thị</p>
      )}
    </div>
  );
};

export default ModelCategories;
