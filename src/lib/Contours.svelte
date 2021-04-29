<script>
  import { getChartContext } from "@sveltejs/pancake/components/Chart.svelte";
  import * as d3 from "d3";

  export let color;
  export let thresholds;
  export let xshape;
  export let yshape;
  export let grid;

  // let scalex;
  // let scaley;

  // let { width, height } = getChartContext();

  const { x_scale, y_scale, x1, y1, x2, y2 } = getChartContext();

  $: contours = d3
    .contours()
    .size([xshape, yshape])
    .thresholds(thresholds)(grid)
    .map(transform)

  let scale_x = (x) => $x1 + (x * ($x2 - $x1)) / xshape;
  let scale_y = (y) => $y1 + (y * ($y2 - $y1)) / yshape;

  // Converts from grid coordinates (indexes) to screen coordinates (pixels).
  let transform = ({ type, value, coordinates }) => {
    return {
      type,
      value,
      coordinates: coordinates.map((rings) => {
        return rings.map((points) => {
          return points.map(([x, y]) => [$x_scale(scale_x(x)), $y_scale(scale_y(y))]);
        });
      })
    };
  };
</script>

{#each contours as c, i}
  <path d={d3.geoPath()(c)} fill={color(thresholds[i])} />
{/each}
