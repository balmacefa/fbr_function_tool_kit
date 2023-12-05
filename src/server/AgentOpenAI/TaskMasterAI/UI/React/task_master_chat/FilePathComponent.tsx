import React from "react";
import { FilePath } from "./types";

interface FilePathProps {
  file_path: FilePath["file_path"];
}

const FilePathComponent: React.FC<FilePathProps> = ({ file_path }) => {
  return <a href={file_path.file_id}>File Link</a>;
};

export default FilePathComponent;
