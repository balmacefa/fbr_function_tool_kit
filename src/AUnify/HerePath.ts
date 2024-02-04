import path from "path";

// export const AppPath = dirname(fileURLToPath(import.meta.url));

const Here = __dirname;


// export const GetChatView = (str: string) => path.join(AppPath, '/ChatApp/' + str + '.ejs');
export const Here_add = (add: string) => path.join(Here, add);
