import UrlJoin from "url-join";

// Convert a FileList to file info for UploadFiles
export const FileInfo = async (path, fileList, noData=false) => {
  return await Promise.all(
    Array.from(fileList).map(async file => {
      const data = noData ? undefined : await new Response(file).blob();
      const filePath = file.overrideName || file.webkitRelativePath || file.name;
      return {
        path: UrlJoin(path, filePath).replace(/^\/+/g, ""),
        type: "file",
        size: file.size,
        data
      };
    })
  );
};
