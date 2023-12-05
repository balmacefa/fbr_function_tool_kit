import { Layout } from "antd";
import React from "react";
import ChatLog from "./ChatLog";
import MessageInput, { onMessageSendFunc } from "./MessageInput";
import Sidebar from "./Sidebar";
import "./TaskMasterChat.css"; // import your CSS file
import { ChatMessage, ChatRoom } from "./types";

export interface TaskMasterChatProps {
  rooms: ChatRoom[];
  // onRoomSelect: (roomId: number) => void;
  messages: ChatMessage[];
  onMessageSend: onMessageSendFunc;
  // onMessageSend: (message: string) => void;
}

const TaskMasterChat: React.FC<TaskMasterChatProps> = ({
  messages,
  rooms,
  onMessageSend,
}) => {
  const handleRoomSelect = (roomId: number) => {
    console.log("Selected room:", roomId);
    // Implement room selection logic here
  };

  return (
    <Layout className="IndexTaskMasterContainer">
      <Layout.Sider width={200} theme="light">
        <Sidebar rooms={rooms} onRoomSelect={handleRoomSelect} />
      </Layout.Sider>
      <Layout.Content style={{ overflow: "auto" }}>
        <Layout.Header className="chat-header">Chat Application</Layout.Header>
        <Layout.Content style={{ overflow: "auto" }}>
          <ChatLog messages={messages} />
        </Layout.Content>
        <Layout.Footer style={{ padding: "16px" }}>
          <MessageInput onMessageSend={onMessageSend} />
        </Layout.Footer>
      </Layout.Content>
    </Layout>
  );
};

export default TaskMasterChat;
