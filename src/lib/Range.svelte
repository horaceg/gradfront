<script>
	export let value;
	export let name;
	export let mini;
	export let maxi;
	export let step;
</script>

<div>{name}</div>
<input type="number" min={mini} max={maxi} {step} bind:value />
<input type="range" min={mini} max={maxi} {step} bind:value />
