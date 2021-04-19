<script>
  import * as Pancake from "@sveltejs/pancake";
  import { fade } from "svelte/transition";

  export let data;
  export let step;

  $: points = data.map((l, i) => ({ x: i, y: l }));
  $: maxx = data.length - 1;
  $: maxy = Math.max(...data);
</script>

<div class="chart">
  <Pancake.Chart x1={0} x2={maxx} y1={0} y2={maxy}>
    <Pancake.Box x2={maxx} y2={maxy}>
      <div class="axes" />
    </Pancake.Box>

    <Pancake.Grid vertical count={5} let:value>
      <span in:fade class="x label">{value}</span>
    </Pancake.Grid>

    <Pancake.Grid horizontal count={3} let:value let:first>
      <span in:fade class="y label">{value}</span>
    </Pancake.Grid>

    <Pancake.Svg>
      <Pancake.SvgLine data={points} let:d>
        <path in:fade class="data" {d} />
      </Pancake.SvgLine>

      <Pancake.SvgPoint x={step} y={data[step]} let:d>
        <path in:fade class="highlight" {d} />
      </Pancake.SvgPoint>
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
    stroke: rgb(12, 182, 194);
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 10px;
    fill: none;
  }
</style>
