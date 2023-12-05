// Sidebar.tsx
import { Menu } from "antd";
import React from "react";
import { ChatRoom } from "./types"; // Assuming you have defined this

interface SidebarProps {
  rooms: ChatRoom[]; // Replace with actual props as needed
  onRoomSelect: (roomId: number) => void; // Callback for room selection
}

const Sidebar: React.FC<SidebarProps> = ({ rooms, onRoomSelect }) => {
  return (
    <div className="sidebar">
      <Menu mode="inline" defaultSelectedKeys={["1"]}>
        {rooms.map((room) => (
          <Menu.Item
            className="sidebar-room"
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
          >
            {room.name}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default Sidebar;
