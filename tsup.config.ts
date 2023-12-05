import { defineConfig } from 'tsup'

// src/server/index.ts --format cjs,esm --dts

// TODO: Const entries = generate base on src directory. // and implemente on entry ops array bellow
export default defineConfig((options) => {
  return {
    entry: ['src/lib_index.ts'],
    format: ['cjs', 'esm'],
    target: ['node18'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: !options.watch,
  }
})



/**
 * 
 * It's equivalent to the following tsup.config.ts:

export default defineConfig({
  // Outputs `dist/a.js` and `dist/b.js`.
  entry: ['src/a.ts', 'src/b.ts'],
  // Outputs `dist/foo.js` and `dist/bar.js`
  entry: {
    foo: 'src/a.ts',
    bar: 'src/b.ts',
  },
})
 */