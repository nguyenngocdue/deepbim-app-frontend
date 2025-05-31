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

  export type  DialogTemplateProps = {
  open: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  disableOutsideClose?: boolean;
  className?: string;
  iconType: "view"|"create" |"edit"|"move"|"delete";
  onApply: ()=>void,
  onApplyText: "Save" |"Apply" | "Create" | "View Model" | "Delete",
  onCancelText:"Cancel",
  applyType: "button" | "submit"
}

  