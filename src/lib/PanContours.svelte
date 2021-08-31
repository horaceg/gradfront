<script>
  import Contours from "$lib/Contours.svelte";
  import * as Pancake from "@sveltejs/pancake";
  import * as tf from "@tensorflow/tfjs";
  import { scaleSequential } from "d3-scale";
  import { interpolatePurples } from "d3-scale-chromatic"
  import { spring } from "svelte/motion";
  
  export let lossBatch;
  export let step;
  export let params;
  export let init_params;

  let _params = spring();
  let xstep = spring();
  let ystep = spring();

  $: $_params = params;
  $: $xstep = Math.max(xmin, Math.min(xmax, params[step][0][0]));
  $: $ystep = Math.max(ymin, Math.min(ymax, params[step][1]));
  $: filtered_params = $_params.map((d) => [
    [Math.max(xmin, Math.min(xmax, d[0][0]))],
    Math.max(ymin, Math.min(ymax, d[1]))
  ]);

  let xmin = -4;
  let xmax = 4;
  let ymin = -4;
  let ymax = 4;

  let x_points = 60;
  let y_points = 60;
  let max_thresh = 2;
  let nthresh = 20;

  let thresholds = tf.linspace(0, max_thresh, nthresh).arraySync();
  // $: thresholds = d3.bin().domain([0, 2]).thresholds()(grid)
  thresholds.reverse();
  let color = scaleSequential(interpolatePurples).domain([0, max_thresh]);

  $: ygrid = tf.linspace(ymin, ymax, y_points);

  $: xgrid = tf.linspace(xmin, xmax, x_points);

  // the only way I found to sort the tensor is with topk
  $: ytiled = tf.topk(tf.tile(ygrid, xgrid.shape), xgrid.shape[0] * ygrid.shape[0], {
    sorted: true
  }).values;

  $: xtiled = tf.tile(xgrid, ygrid.shape);

  $: grid = lossBatch(xtiled.reshape([1, -1]), ytiled).arraySync();
</script>

<div class="chart">
  <Pancake.Chart x1={xmin} x2={xmax} y1={ymin} y2={ymax}>
    <Pancake.Grid horizontal count={5} let:value let:first>
      <div class="grid-line horizontal" class:first><span>{value}</span></div>
    </Pancake.Grid>

    <Pancake.Grid vertical count={6} let:value let:first>
      <!-- <div class="grid-line vertical" class:first> -->
      <span class="x-label">{value}</span>
      <!-- </div> -->
    </Pancake.Grid>

    <Pancake.Svg>
      <Contours {grid} {thresholds} {color} xshape={x_points} yshape={y_points} bind:init_params />
      <Pancake.SvgLine data={filtered_params} x={(d) => d[0][0]} y={(d) => d[1]} let:d>
        <path class="traj" fill="none" {d} />
      </Pancake.SvgLine>
      <Pancake.SvgScatterplot data={filtered_params} x={(d) => d[0][0]} y={(d) => d[1]} let:d>
        <path class="traj-points" {d} />
      </Pancake.SvgScatterplot>
      <Pancake.SvgPoint x={$xstep} y={$ystep} let:d>
        <path class="point" {d} />
      </Pancake.SvgPoint>
      <Pancake.SvgPoint x={filtered_params[0][0][0]} y={filtered_params[0][1]} let:d>
        <path class="point-start" {d} />
      </Pancake.SvgPoint>
    </Pancake.Svg>
  </Pancake.Chart>
</div>

<style>
  .chart {
    height: 100%;
    padding: 3em 0 2em 2em;
    margin: 0 0 36px 0;
    position: relative;
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

  .point {
    stroke: rgb(12, 182, 194);
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 10px;
    fill: none;
  }

  path.traj {
    stroke: orange;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2px;
    fill: none;
  }

  path.traj-points {
    stroke: orange;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 5px;
    fill: none;
  }
  path.point-start {
    stroke: orange;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 10px;
    fill: none;
  }
</style>
