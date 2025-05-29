/**
 * Download a file from a given URL.
 * @param fileUrl   The URL of the file to download.
 * @param fileName  The desired filename (if not provided, filename is taken from URL or defaults to "download").
 */
export function downloadFile(fileUrl: string, fileName?: string) {
  if (!fileUrl) return;
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName || fileUrl.split("/").pop() || "download";
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
