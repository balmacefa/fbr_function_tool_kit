import path, { dirname } from "path";
import { fileURLToPath } from "url";

const ViewsAppPath = dirname(fileURLToPath(import.meta.url));

export const GetEditView = (str: string) => path.join(ViewsAppPath, '/EDIT/' + str + '.ejs');
export const GetShowView = (str: string) => path.join(ViewsAppPath, '/SHOW/' + str + '.ejs');
