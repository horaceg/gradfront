<script>
    import * as Pancake from '@sveltejs/pancake';
	import { fade } from 'svelte/transition';
	export let predictions;
    export let ytrue;
    export let features;
	
    $: points = predictions.map((p, i) => ({ x: features[i][0], pred: p, y: ytrue[i] }))
	// $: predictions.map(el => (el < ymin? ymin = el : {}))
	let ymin = 0.6
	let ymax = 1.05
	let xmin = 0
	let xmax = 1
    // $: ymin = Math.min(...predictions)
    // $: ymax = Math.max(...predictions)

    // $: xmin = Math.min(...features)
    // $: xmax = Math.max(...features)

</script>

<div class="chart">
	<Pancake.Chart x1={xmin} x2={xmax} y1={ymin} y2={ymax}>
		<Pancake.Grid horizontal count={5} let:value let:first>
			<div class="grid-line horizontal" class:first><span>{value}</span></div>
		</Pancake.Grid>

		<Pancake.Grid vertical count={10} let:value>
			<div class="grid-line vertical" />
			<span class="year-label">{value}</span>
		</Pancake.Grid>

		<Pancake.Svg>
			<Pancake.SvgScatterplot data={points} x={(d) => d.x} y={(d) => d.y} let:d>
				<path class="data" {d} />
			</Pancake.SvgScatterplot>

            <Pancake.SvgLine data={points} x="{d => d.x}" y="{d => d.pred}" let:d >
				<path transition:fade class="predictions" {d} />
			</Pancake.SvgLine>
            
			<Pancake.Quadtree data={points} x={(d) => d.x} y={(d) => d.y} let:closest>
				{#if closest}
					<Pancake.SvgPoint x={closest.x} y={closest.y} let:d>
						<path class="highlight" {d} />
					</Pancake.SvgPoint>
				{/if}
			</Pancake.Quadtree>
		</Pancake.Svg>
    </Pancake.Chart>
</div>

<style>
	.chart {
		height: 100%;
		padding: 3em 0 2em 2em;
		margin: 0 0 36px 0;
	}

	.grid-line {
		position: relative;
		display: block;
	}

	.grid-line.horizontal {
		width: calc(100% + 2em);
		left: -2em;
		border-bottom: 1px dashed #ccc;
	}

	.grid-line.vertical {
		height: 100%;
		border-left: 1px dashed #ccc;
	}

	.grid-line.first {
		border-bottom: 1px solid #333;
	}

	.grid-line span {
		position: absolute;
		left: 0;
		bottom: 2px;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
	}

	.year-label {
		position: absolute;
		width: 4em;
		left: -2em;
		bottom: -22px;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
		text-align: center;
	}

	path.data {
		stroke: rgb(171, 0, 214);
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 6px;
		fill: none;
	}

	path.predictions {
		stroke: rgb(12, 182, 194);
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 3px;
		fill: none;
	}

	path.highlight {
		stroke: rgb(171, 0, 214);
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 10px;
		fill: none;
	}
</style>