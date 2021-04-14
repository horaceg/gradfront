<script>
	import { max } from 'd3-array';
	import { scaleLinear } from 'd3-scale';
	import { line } from 'd3-shape';
	import Axis from './Axis.svelte';

	export let losses;
	$: data = losses.map((l, i) => ({ step: i, value: l }));

	let clientWidth;
	$: width = clientWidth;

	const height = 400;
	const margin = 40;

	$: xScale = scaleLinear()
		.domain([0, max(data, (d) => d.step)])
		.range([margin, width - margin]);

	$: yScale = scaleLinear()
		.domain([0, max(data, (d) => d.value)])
		.range([height - margin, margin]);

	$: lineGenerator = line()
		.x((d) => xScale(d.step))
		.y((d) => yScale(d.value));

	$: reveal = (node, { duration }) => {
		if (!xScale || !yScale) return;
		const length = node.getTotalLength();
		node.style.strokeDasharray = length;
		return {
			duration,
			css: (t, u) => `stroke-dashoffset: ${u * length}`
		};
	};
</script>

<div class="line-chart" bind:clientWidth>
	{#if width}
		<svg {width} {height}>
			<Axis {width} {height} {margin} scale={xScale} position="bottom" />
			<Axis {width} {height} {margin} scale={yScale} position="left" />
			<path
				d={lineGenerator(data)}
				stroke="rebeccapurple"
				stroke-width={2}
				stroke-linecap="round"
				fill="none"
				in:reveal={{ duration: 0 }}
			/>
		</svg>
	{/if}
</div>
