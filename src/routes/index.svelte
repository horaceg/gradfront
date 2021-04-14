<script>
	import { browser } from '$app/env';
	import LossChart from '$lib/LossChart.svelte';
	import { derived, writable } from 'svelte/store';

	let init_key = writable(1);
	let sliding = false;
	function handleSliding() {
		sliding = true;
	}

	function handleMousup() {
		sliding = false;
	}

	// let init_key = 1;
	// let res = { loss: [1, 0.5] };

	// $: browser
	// 	? fetch(`https://gradapi.fly.dev/linear/${init_key}`)
	// 			.then((response) => response.json())
	// 			.then((data) => (is_latest || mousedown) && (res = data))
	// 	: {};

	let res = derived(
		init_key,
		($init_key, set) => {
			let is_latest = true;
			browser
				? fetch(`https://gradapi.fly.dev/linear/${$init_key}`)
						.then((response) => response.json())
						.then((data) => (is_latest || sliding) && set(data))
						.catch((error) =>  (is_latest || sliding) && set(error))
				: { loss: [1, 0.5] };

			return () => {
				is_latest = false;
			};
		},
		{ loss: [1, 0.5] }
	);

	$: losses = $res.loss;
</script>

<main>
	<h1>Hello world!</h1>

	<input type="range" bind:value={$init_key} on:input={handleSliding} on:mouseup={handleMousup} />

	<p>{$init_key}, {losses[0]}</p>

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
