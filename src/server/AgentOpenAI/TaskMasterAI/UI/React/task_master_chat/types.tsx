// types.ts

// Enum for the role of the message sender
export enum Role {
  User = "user",
  Assistant = "assistant",
}

// Interface for text content in a message
export interface TextContent {
  type: "text";
  text: {
    value: string;
    annotations: Annotation[]; // Define more specifically if needed
  };
}

export interface FileCitation {
  type: "file_citation";
  text: string;
  file_citation: {
    file_id: string;
    quote: string;
    start_index: number;
    end_index: number;
  };
}

export interface FilePath {
  type: "file_path";
  text: string;
  file_path: {
    file_id: string; //The ID of the file that was generated.
  };
}

export type Annotation = FileCitation | FilePath;

// Interface for an image file
export interface ImageFile {
  file_id: string; // Unique identifier for the image file
}

// Interface for image content in a message
export interface ImageContent {
  type: "image_file";
  image_file: ImageFile;
}

// Union type for message content (text or image)
export type MessageContent = TextContent | ImageContent;

// Interface for the main message object

export interface File {
  id: string; // The file identifier
  bytes: number; // The size of the file in bytes
  created_at: number; // Unix timestamp for when the file was created
  filename: string; // The name of the file
  object: "file"; // The object type, always 'file'
  purpose:
    | "fine-tune"
    | "fine-tune-results"
    | "assistants"
    | "assistants_output"; // The intended purpose of the file
}

export interface ChatMessage {
  id: string;
  object: "thread.message";
  created_at: number;
  thread_id: string;
  role: Role;
  content: MessageContent[];
  file_ids: string[];
  assistant_id?: string | null;
  run_id?: string | null;
  metadata: Record<string, string>;
}

// types.ts
export interface ChatRoom {
  id: string | number;
  name: string;
}
