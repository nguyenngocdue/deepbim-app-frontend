export type Model = {
    id: string;
    name: string;
    status: string;
    size: number;
    uploader: {
      email: string;
      avatar: string;
    };
    modified: string;
  };
  
  export type ModelTableProps = {
    data: Model[];
    refeshData: () => void;
  };
  