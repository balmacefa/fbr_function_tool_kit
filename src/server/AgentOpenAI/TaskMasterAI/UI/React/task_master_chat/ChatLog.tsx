// ChatLog.tsx
import React from "react";
import ImageMessageComponent from "./ImageMessageComponent";
import TextMessageComponent from "./TextMessageComponent";
import { ChatMessage, Role } from "./types";

export interface ChatLogProps {
  messages: ChatMessage[];
}
// ... existing imports

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {
  // Inside your map function
  const messageClassName = (message: ChatMessage) =>
    `chat_item chat-message ${
      message.role === Role.User ? "user-message" : "assistant-message"
    }`;
  // Add className={messageClassName} to your <div className="chat_item">

  return (
    <div className="chat-log">
      {messages.map((message) =>
        message.content.map((content, index) => {
          switch (content.type) {
            case "text":
              return (
                <>
                  <div className={messageClassName(message)}>
                    <TextMessageComponent key={index} textContent={content} />
                  </div>
                </>
              );
            case "image_file":
              return (
                <div className={messageClassName(message)}>
                  <ImageMessageComponent key={index} imageContent={content} />
                </div>
              );
            default:
              return null;
          }
        })
      )}
    </div>
  );
};

export default ChatLog;
