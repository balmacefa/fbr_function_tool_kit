import path from "path";

const ViewsAppPath = __dirname;

export const GetEditView = (str: string) => path.join(ViewsAppPath, '/EDIT/' + str + '.ejs');
export const GetShowView = (str: string) => path.join(ViewsAppPath, '/SHOW/' + str + '.ejs');
