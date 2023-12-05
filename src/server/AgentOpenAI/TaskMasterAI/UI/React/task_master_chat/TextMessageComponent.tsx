import { Typography } from "antd";
import React from "react";
import FileCitationComponent from "./FileCitationComponent";
import FilePathComponent from "./FilePathComponent";
import { TextContent } from "./types";
const { Text } = Typography;

interface TextMessageProps {
  textContent: TextContent;
}

const TextMessageComponent: React.FC<TextMessageProps> = ({ textContent }) => {
  const {
    text: { value, annotations },
    type,
  } = textContent;

  return (
    <div className="TextMessageComponent">
      <Text className={type + "_TextMessageComponent"}>
        {value}
        {annotations.map((annotation, index) => {
          switch (annotation.type) {
            case "file_citation":
              return (
                <FileCitationComponent key={index} citation={annotation} />
              );
            case "file_path":
              return (
                <FilePathComponent
                  key={index}
                  file_path={annotation.file_path}
                />
              );
            default:
              return null;
          }
        })}
      </Text>
    </div>
  );
};

export default TextMessageComponent;
