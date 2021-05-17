<script>
  import * as Pancake from "@sveltejs/pancake";
  import * as easings from "svelte/easing";
  import { spring, tweened } from "svelte/motion";

  export let predictions;
  export let ytrue;
  export let features;
  export let errorsVisible;

  $: points = ytrue.map((t, i) => ({ x: features[i][0], y: t }));
  $: pts_pred = [...predictions.map((p, i) => ({ x: features[i][0], y: p, yt: ytrue[i]}))].sort((a, b) => (a.x - b.x))

  let tweenedPoints = spring()

  $: $tweenedPoints = pts_pred;

  let ymin = spring();
  let ymax = spring();
  let xmin = spring();
  let xmax = spring();
  $: $ymin = Math.min(...ytrue)
  $: $ymax = Math.max(...ytrue)

  $: $xmin = Math.min(...features)
  $: $xmax = Math.max(...features)
</script>

<div class="chart">
  <Pancake.Chart x1={$xmin} x2={$xmax} y1={$ymin} y2={$ymax}>
    <Pancake.Grid horizontal count={5} let:value let:first>
      <div class="grid-line horizontal" class:first><span>{value}</span></div>
    </Pancake.Grid>

    <Pancake.Grid vertical count={6} let:value>
      <div class="grid-line vertical" />
      <span class="x-label">{value}</span>
    </Pancake.Grid>

    <Pancake.Svg>
      <Pancake.SvgScatterplot data={points} let:d>
        <path class="data" {d} />
      </Pancake.SvgScatterplot>

      <Pancake.SvgLine data={$tweenedPoints.filter((d) => (d.y < $ymax) & (d.y > $ymin))} let:d>
        <path class="predictions" {d} />
      </Pancake.SvgLine>
      {#if errorsVisible}
        {#each $tweenedPoints as {x, y, yt}, i}
          <Pancake.SvgLine data={[{x: x, y: Math.max(Math.min(y, $ymax), $ymin)}, {x: x, y: yt}]} let:d>
            <path class="errors" {d}>
          </Pancake.SvgLine>
          {/each}
      {/if}
        <Pancake.Quadtree data={points} let:closest>
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
/* 
  .grid-line.first {
    border-bottom: 1px solid #333;
  } */

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
    stroke: rgb(171, 0, 214);
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 8px;
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

  path.errors {
    stroke: red;
    stroke-dasharray: 5, 5;
    stroke-opacity: 0.5;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 1.5px;
    fill: none;
  }
  
</style>
