import { Typography } from "antd";
import React from "react";
import { FileCitation } from "./types";

interface FileCitationProps {
  citation: FileCitation;
}

const FileCitationComponent: React.FC<FileCitationProps> = ({ citation }) => {
  const {
    text,
    file_citation: { quote, file_id },
  } = citation;
  return (
    <>
      <Typography.Text className="file_citation">
        {text}
        <a href={`https://www.notion.so/${file_id}?v=${quote}`} target="_blank">
          {quote}
        </a>
      </Typography.Text>
    </>
  );
};

export default FileCitationComponent;
