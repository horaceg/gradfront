<script>
  import * as Pancake from "@sveltejs/pancake";
  import { tweened } from "svelte/motion";

  export let data;
  export let step;
  export let refresh;

  let points = tweened(null, { duration: refresh });
  let xstep = tweened(null, { duration: refresh });
  let ystep = tweened(null, { duration: refresh });
  let ymax = tweened(null, { duration: refresh });

  $: boundData = data.map((l, i) => ({ x: i, y: Math.min(l, 100) }));
  $: $points = boundData;
  $: xmax = data.length - 1;
  $: $ymax = Math.max(...data);
  $: $xstep = step;
  $: $ystep = boundData[step].y;
</script>

<div class="chart">
  <Pancake.Chart x1={0} x2={xmax} y1={0} y2={$ymax}>
    <Pancake.Grid vertical count={5} let:value>
      <span class="x-label">{value}</span>
    </Pancake.Grid>
    <Pancake.Grid horizontal count={5} let:value let:first>
      <div class="grid-line horizontal" class:first><span>{value}</span></div>
    </Pancake.Grid>

    <Pancake.Svg>
      <Pancake.SvgLine data={$points.filter((d) => (d.y <= $ymax) & (d.y > 0))} let:d>
        <path class="data" {d} />
      </Pancake.SvgLine>

      <Pancake.SvgPoint x={$xstep} y={$ystep} let:d>
        <path class="highlight" {d} />
      </Pancake.SvgPoint>
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

  .x-label {
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
    stroke: red;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2px;
    fill: none;
  }

  path.highlight {
    /* stroke: rgb(12, 182, 194); */
    stroke: red;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 10px;
    fill: none;
  }
</style>
