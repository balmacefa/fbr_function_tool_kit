import React from "react";
import { ImageContent } from "./types";

interface ImageMessageProps {
  imageContent: ImageContent;
}

const ImageMessageComponent: React.FC<ImageMessageProps> = ({
  imageContent,
}) => {
  const {
    image_file: { file_id },
  } = imageContent;
  // The URL construction might vary depending on how your server serves images.
  // Here's a basic example assuming the images are served from a static directory.
  const imageUrl = `https://placehold.co/600x400/000000/FFFFFF/svg`;

  return (
    <div className="image-message">
      <img
        src={imageUrl}
        alt="Chat Image"
        style={{ maxWidth: "100%", borderRadius: "10px" }}
      />
    </div>
  );
};

export default ImageMessageComponent;
