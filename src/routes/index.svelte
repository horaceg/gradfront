<script>
	import { browser } from '$app/env';
	import LineChart from '$lib/LineChart.svelte';
	import Range from '$lib/Range.svelte';
	import Select from '$lib/Select.svelte';

	let init_key = 1;
	let lr = 0.1;
	let momentum = 0.2;

	let res = { loss: [1, 0.5], predictions: [[0], [1]] };

	$: descendUrl = `https://gradapi.fly.dev/linear?init_key=${init_key}&lr=${lr}&momentum=${momentum}`;
	$: browser
		? fetch(descendUrl)
				.then((response) => response.json())
				.then((data) => (res = data))
				.catch((error) => console.log(error))
		: {};
	$: losses = res.loss
</script>

<main>
	<Select
		name="Random key"
		options={new Array(10).fill().map((_, i) => i + 1)}
		bind:value={init_key}
	/>
	<Range name="Learning rate" mini={0} maxi={1} step={0.02} bind:value={lr} />
	<Range name="Momentum" mini={0} maxi={0.95} step={0.02} bind:value={momentum} />
</main>
<div class="chart-ctn">
	<LineChart bind:data={losses} />
</div>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
	.chart-ctn {
		height: 70vh;
		width: 90vw;
	}
</style>
