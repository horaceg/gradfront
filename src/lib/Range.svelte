<script>
	export let value;
	export let name;
	export let mini;
	export let maxi;
	export let step;
</script>

<div>
	<label for={name}>{name}</label>
	<input id={name} type="number" min={mini} max={maxi} {step} bind:value />
	<input id={name} type="range" min={mini} max={maxi} {step} bind:value />
</div>

<style>
	input[type='number'] {
		width: 3.1em;
	}
</style>
