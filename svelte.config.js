import sstatic from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: sstatic(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    ssr: true,
    vite: {
      build: {
        chunkSizeWarningLimit: 2000
      }
    }
  }
};

export default config;
