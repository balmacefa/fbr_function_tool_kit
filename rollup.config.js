// TODO: use main)utils class to
// export an string array of paths base on the current directory folders,
// and look for index.ts, copy the path into the array.

import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";

export default (commandLineArgs) => {
  return {
    input: ["src/lib_index.ts"],
    output: [
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
      },
      {
        dir: "dist",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      del({ targets: "dist/*" }),
      typescript({ tsconfig: "./tsconfig.json" }), // Assuming you have a tsconfig.json
      !commandLineArgs.watch && terser(),
    ],
  };
};
