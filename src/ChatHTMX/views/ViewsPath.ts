import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const ChatHTMXViewsChatAppPath = dirname(fileURLToPath(import.meta.url));

export const GetChatView = (str: string) => path.join(ChatHTMXViewsChatAppPath, '/ChatApp/' + str + '.ejs');
export const GetMarkdocView = (str: string) => path.join(ChatHTMXViewsChatAppPath, '/mardoc/' + str + '.ejs');
