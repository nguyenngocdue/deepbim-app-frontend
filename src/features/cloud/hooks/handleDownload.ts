import { downloadFile } from "@/utils/file";

  export const handleDownload = (file: any): void => {
      if (file) {
          const url = file?.media.url;
          const fileName = file.name;
          downloadFile(url, fileName);
      }
  };