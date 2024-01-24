import path from "path";

// export const AppPath = dirname(fileURLToPath(import.meta.url));

const Here = __dirname;


// export const GetChatView = (str: string) => path.join(AppPath, '/ChatApp/' + str + '.ejs');
export const GetProjectA_tsconfig = () => path.join(Here, 'tsconfig.json');
export const GetAnalizersGeneric_path = (_path: string) => path.join(Here, _path);
