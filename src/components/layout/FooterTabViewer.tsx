import ChunkedModelLoader from "@/features/chunk/ChunkedModelLoader";
import SidebarTabs from "./SidebarTabs";
import ChunkUploader from "@/features/chunk/ChunkUploader";


export default function FooterTabViewer({
  themeClass,
}: {
  themeClass: string;
}) {
  return (
    <>
      <SidebarTabs
        themeClass={themeClass}
        tabs={[
          {
            name: "Chunk",
            value: "chunk",
            content: <ChunkUploader  />,
          },
          {
            name: "Combine Chunks",
            value: "chunks",
            content: <ChunkedModelLoader  />,
          }       
        ]}
      />
    </>
  );
}