<script>
	import Counter from '$lib/Counter.svelte';
	import LossChart from '$lib/LossChart.svelte';

	let init_key = 1;
	let res = { loss: [0] };
	$: (async () => {
		res = await fetch(`https://gradapi.fly.dev/linear/${init_key}`)
			.then((resp) => resp.json())
			.then((data) => {
				return data;
			});
	})();
	$: losses = res.loss;
</script>

<main>
	<h1>Hello world!</h1>

	<input type="range" bind:value={init_key} />

	<p>{init_key}, {losses[0]}</p>

	<LossChart {losses} />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
	}

	p {
		max-width: 14rem;
		margin: 2rem auto;
		line-height: 1.35;
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}

		p {
			max-width: none;
		}
	}
</style>
