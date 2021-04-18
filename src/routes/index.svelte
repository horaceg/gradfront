<script>
  import { browser } from "$app/env";
  import LineChart from "$lib/LineChart.svelte";
  import Range from "$lib/Range.svelte";
  import ScatterPred from "$lib/ScatterPred.svelte";
  import Select from "$lib/Select.svelte";

  let init_key = 1;
  let lr = 0.1;
  let momentum = 0.2;
  let step = 0;
  let res = { loss: [1, 0.5], predictions: [[0], [1]], x: [[0.5]], y: [0.3] };

  $: descendUrl = `http://gradapi.fly.dev/linear?init_key=${init_key}&lr=${lr}&momentum=${momentum}`;
  $: browser
    ? fetch(descendUrl)
        .then((response) => response.json())
        .then((data) => (res = data))
        .catch((error) => console.log(error))
    : {};
  $: losses = res.loss;
  $: pred_step = res.predictions[step];
</script>

<main class="inputs-ctn">
  <div class="inputs">
    <Select
      name="Random key"
      options={new Array(10).fill().map((_, i) => i + 1)}
      bind:value={init_key}
    />
    <Range name="Learning rate" mini={0} maxi={1} step={0.02} bind:value={lr} />
    <Range name="Step" mini={0} maxi={losses.length - 1} step={1} bind:value={step} />
    <Range name="Momentum" mini={0} maxi={0.95} step={0.02} bind:value={momentum} />
  </div>
</main>

<div class="chart">
  <LineChart data={losses} />
</div>

<div class="chart">
  <ScatterPred predictions={pred_step} ytrue={res.y} features={res.x} />
</div>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
  .chart {
    height: 35vh;
    width: 40vw;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2px;
  }

  .inputs-ctn {
    width: 50vw;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>
