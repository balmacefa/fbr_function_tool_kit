import path from "path";

// export const AppPath = dirname(fileURLToPath(import.meta.url));

const AppPath = __dirname;


// export const GetChatView = (str: string) => path.join(AppPath, '/ChatApp/' + str + '.ejs');
export const GetProjectA_tsconfig = () => path.join(AppPath, 'tsconfig.json');
export const GetProjectA_path = (_path: string) => path.join(AppPath, _path);
