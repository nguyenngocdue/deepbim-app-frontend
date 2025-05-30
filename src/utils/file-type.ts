export function mapExtensionToType(ext: string): string {
  ext = ext.toLowerCase();
  if (["jpg", "jpeg", "png", "bmp", "webp", "gif", "svg", "heic", "tiff", 'jfif'].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "aac"].includes(ext)) return "audio";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  if (["js", "ts", "py", "java", "c", "cpp", "cs", "rb", "go", "php"].includes(ext)) return "code";
  if (["xlsx", "xls", "csv"].includes(ext)) return "excel";
  if (["doc", "docx"].includes(ext)) return "word";
  if (["ppt", "pptx"].includes(ext)) return "ppt";
  if (["pdf"].includes(ext)) return "pdf";  
  if (["ifc"].includes(ext)) return "ifc";
  if (["txt", "md"].includes(ext)) return "note";
  return "other";
}
