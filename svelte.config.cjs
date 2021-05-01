const sstatic = require('@sveltejs/adapter-static');

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	kit: {
		adapter: sstatic(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		ssr: true,
	}
};
