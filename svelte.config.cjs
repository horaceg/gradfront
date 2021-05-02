const sstatic = require("@sveltejs/adapter-static");
const copy = require("rollup-plugin-copy");

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
  kit: {
    adapter: sstatic(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    ssr: true,
    vite: {
      build: {
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
          plugins: [
            copy({
              targets: [
                { src: "node_modules/@tensorflow/tfjs-backend-wasm/**/*.wasm", dest: "static/" }
              ]
            })
          ]
        }
      }
    }
  }
};
