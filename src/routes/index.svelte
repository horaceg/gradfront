<script>
	import { browser } from '$app/env';
	import LossChart from '$lib/LossChart.svelte';
	import Range from '$lib/Range.svelte';

	let init_key = 1;
	let lr = 0.1;
	let momentum = 0.2;

	let res = { loss: [1, 0.5] };

	$: descendUrl = `https://gradapi.fly.dev/linear?init_key=${init_key}&lr=${lr}&momentum=${momentum}`;
	$: browser
		? fetch(descendUrl)
				.then((response) => response.json())
				.then((data) => (res = data))
				.catch((error) => console.log(error))
		: {};
	$: losses = res.loss;
</script>

<main>
	<Range name="init_key" mini={0} maxi={100} step={1} bind:value={init_key} />
	<Range name="lr" mini={0} maxi={1} step={0.05} bind:value={lr} />
	<Range name="momentum" mini={0} maxi={0.95} step={0.05} bind:value={momentum} />
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
