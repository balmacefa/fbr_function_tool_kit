// MessageInput.tsx
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Menu, Upload } from "antd";
import React, { useState } from "react";

const { TextArea } = Input;

export type onMessageSendFunc = (message: string) => void;

export interface MessageInputProps {
  onMessageSend: onMessageSendFunc;
}

const MessageInput: React.FC<MessageInputProps> = ({ onMessageSend }) => {
  const [message, setMessage] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  const handleTemplateSelect = (template: string) => {
    setMessage(template);
    setShowTemplates(false);
  };

  const templates = ["Hello!", "Can I help you?", "Let's discuss more."]; // Example templates

  const templateMenu = (
    <Menu>
      {templates.map((template, index) => (
        <Menu.Item key={index} onClick={() => handleTemplateSelect(template)}>
          {template}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="message-input ">
      <TextArea
        rows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <Upload className="">
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
      <Dropdown overlay={templateMenu} trigger={["click"]}>
        <Button onClick={() => setShowTemplates(!showTemplates)}>
          Templates <DownOutlined />
        </Button>
      </Dropdown>
      <Button type="primary" onClick={() => onMessageSend(message)}>
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
