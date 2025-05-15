import { TreeNode } from "./FolderTree";

export function mapFolderTreeOnly(nodes: any[]): TreeNode[] {
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
          type: f.media?.extension,
          media: f.media ? { url: f.media.url, extension: f.media.extension } : undefined,
        }))
      : [],
    children: mapFolderTreeOnly(node.children || []),
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
