// ModelAttributes.tsx
import React, { useState, useEffect } from 'react';
import TableComponent from './TableComponent'; // Import the TableComponent

interface Attribute {
  type?: string;
  value: string | number;
}

interface Model {
  getItemsData: (
    localIds: number[],
    options: { attributesDefault: boolean; attributes?: string[] }
  ) => Promise<[Record<string, Attribute>]>; 
}

const getAttributes = async (
  model: Model,
  localId: number,
  attributes?: string[]
): Promise<Record<string, Attribute>> => {
  const [data] = await model.getItemsData([localId], {
    attributesDefault: !attributes,
    attributes,
  });
  return data;
};

interface Content {
  localId: number;
  fragments: Model;
}

const ModelAttributes = ({ content }: { content: Content }) => {
  if (!content) return null; // Early return if no content
  const { localId, fragments } = content;
  const [data, setData] = useState<Record<string, Attribute>>({}); // State to store the data
  const [columns, setColumns] = useState<string[]>(['Attribute', 'Type','Value']); // Dynamic columns

  useEffect(() => {
    if (!localId) {
      return;
    }

    const fetchAttributes = async () => {
      const attributesData = await getAttributes(fragments, localId);
      setData(attributesData);

      // Dynamically set columns based on keys in the fetched data
      const newColumns = ['Attribute','Type' ,'Value']; // Static column names
      setColumns(newColumns);
    };
    fetchAttributes();
  }, [localId, fragments]);


  // Check if localId is missing
  if (!localId) {
    return (
      <div className="text-center text-gray-500">
        No element selected.
      </div>
    );
  }

  // Check if there's no data available
  if (Object.keys(data).length === 0) {
    return (
      <div className="text-center text-gray-500">
        No data available.
      </div>
    );
  }

  // Prepare the data to be passed to the TableComponent
  const dataSource = Object.keys(data).map((key) => ({
    Attribute: key,
    Value: data[key]?.value ?? '',
    Type:  data[key]?.type ?? '',
  }));

  return <TableComponent columns={columns} dataSource={dataSource} />;
};

export default ModelAttributes;
