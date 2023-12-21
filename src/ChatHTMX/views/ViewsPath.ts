import path, { dirname } from "path";
import { fileURLToPath } from "url";

const ViewsChatAppPath = dirname(fileURLToPath(import.meta.url));

export const GetChatView = (str: string) => path.join(ViewsChatAppPath, '/ChatApp/' + str + '.ejs');
