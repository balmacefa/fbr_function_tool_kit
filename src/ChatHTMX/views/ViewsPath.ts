import path from "path";

export const ChatHTMXViewsChatAppPath = __dirname;

export const GetChatView = (str: string) => path.join(ChatHTMXViewsChatAppPath, '/ChatApp/' + str + '.ejs');
export const GetMarkdocView = (str: string) => path.join(ChatHTMXViewsChatAppPath, '/mardoc/' + str + '.ejs');
