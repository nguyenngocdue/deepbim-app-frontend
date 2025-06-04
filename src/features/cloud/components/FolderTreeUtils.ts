import { TreeNode } from "./FolderTree";

export function mapFileInfo(nodes: any[]): TreeNode[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((node) => ({
    id: String(node.id),
    name: node.name,
    isFolder: true,
    isLeaf: false,
    files: Array.isArray(node.files)
      ? node.files.map((f: any) => ({
          id: f.id,
          name: f.name,
          folder_id: f.folder_id,
          type: f.media?.extension,
          media: f.media ? { 
            url_skt: f.media.url_skt,
            url: f.media.url, 
            extension: f.media.extension, 
            view_id: f.media.view_id, 
            size:f.media.size,
            category_id: f.media.category_id,
            category_type: f.media.category_type,
            status:  f.media.status,
            description: f.media.description,
          } : undefined,
          creator: f.creator ? {id : f.creator.id, user_name:  f.creator.user_name, avatar_url: f.creator.mediaUserAvatar?.url} : undefined,
          updated_at: f.updated_at,
        }))
      : [],
    children: mapFileInfo(node.children || []),
  }));
}

export function filterTree(nodes: TreeNode[], keyword: string): TreeNode[] {
  return nodes
    .map((node) => {
      const childMatches = filterTree(node.children || [], keyword);
      const fileMatches = (node.files || []).some((file) =>
        file.name.toLowerCase().includes(keyword)
      );
      const folderMatch = node.name.toLowerCase().includes(keyword);

      if (folderMatch || fileMatches || childMatches.length > 0) {
        return { ...node, children: childMatches };
      }
      return null;
    })
    .filter(Boolean) as TreeNode[];
}

export function findNodeById(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = findNodeById(node.children || [], id);
    if (child) return child;
  }
  return undefined;
}
