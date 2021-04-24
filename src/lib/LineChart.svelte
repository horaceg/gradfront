<script>
  import * as Pancake from "@sveltejs/pancake";
  import { spring, tweened } from "svelte/motion";

  export let data;
  export let step;

  // let pts = data.map((l, i) => ({ x: i, y: l }))
  // let points = spring(pts, {delay: 0, duration: 10});
  let points = spring()

  $: $points = data.map((l, i) => ({ x: i, y: Math.min(l, 100) }));
  // $: points = data.map((l, i) => ({ x: i, y: l }))
  $: xmax = data.length - 1;
  $: ymax = Math.max(...data);
</script>

<div class="chart">
  <Pancake.Chart x1={0} x2={xmax} y1={0} y2={ymax}>
    <Pancake.Box x2={xmax} y2={ymax}>
      <div class="axes" />
    </Pancake.Box>

    <Pancake.Grid vertical count={5} let:value>
      <span class="x label">{value}</span>
    </Pancake.Grid>

    <Pancake.Grid horizontal count={3} let:value let:first>
      <span class="y label">{value}</span>
    </Pancake.Grid>

    <Pancake.Svg>
      <Pancake.SvgLine data={$points.filter(d => (d.y <= ymax) & (d.y > 0))} let:d>
        <path class="data" {d} />
      </Pancake.SvgLine>

      <Pancake.SvgLine data={[{x: step, y: 0}, {x: step, y: ymax}]} let:d>
        <path class="highlight" {d} />
      </Pancake.SvgLine>
    </Pancake.Svg>
  </Pancake.Chart>
</div>

<style>
  .chart {
    height: 100%;
    padding: 3em 2em 2em 3em;
    box-sizing: border-box;
  }

  .axes {
    width: 100%;
    height: 100%;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
  }

  .y.label {
    position: absolute;
    left: -2.5em;
    width: 2em;
    text-align: right;
    bottom: -0.5em;
  }

  .x.label {
    position: absolute;
    width: 4em;
    left: -2em;
    bottom: -22px;
    font-family: sans-serif;
    text-align: center;
  }

  path.data {
    stroke: red;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2px;
    fill: none;
  }

  path.highlight {
    stroke: black;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 1.5px;
    fill: none;
  }
</style>
