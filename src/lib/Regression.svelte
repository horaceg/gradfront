<script>
  import Backward from "$lib/Backward.svelte";
  import LineChart from "$lib/LineChart.svelte";
  import Contours from "$lib/PanContours.svelte";
  import Player from "$lib/Player.svelte";
  import Range from "$lib/Range.svelte";
  import { applyLinear, applyWave, initialize, make_mse, regress, setup } from "$lib/regress";
  import ScatterPred from "$lib/ScatterPred.svelte";
  import Select from "$lib/Select.svelte";
  import * as tf from "@tensorflow/tfjs";

  tf.setBackend("cpu");
  console.log(tf.getBackend());

  let init_params = initialize(2);
  let refresh = 100;
  let playing = false;
  let init_key = 2;
  let lr = 0.63;
  let momentum = 0.75;
  let step = 0;
  let max_step = 30;
  let errorsVisible = true;
  let route = "wave";

  function backward() {
    step = 0;
    playing = false;
  }

  function handleClick() {
    if (step == max_step) {
      playing = false;
      step = 0;
      setTimeout(() => (playing = true), 500);
    }
  }

  function update() {
    if ((step == max_step) & playing) {
      playing = false;
    } else if (playing) {
      setTimeout(update, refresh);
      step += 1;
    }
  }

  let n = 50;

  $: problem = setup(apply, n);
  $: xt = problem.xt;
  $: x = xt.arraySync();
  $: yt = problem.yt;
  $: y = yt.arraySync();
  $: apply = route == "wave" ? applyWave : applyLinear;
  $: res = regress(apply, init_params, lr, momentum, max_step, n);
  $: lrmax = route == "linear" ? 0.2 : 1;
  $: lr = Math.min(lrmax, lr);
  $: lossBatch = make_mse(apply, xt, yt.reshape([-1, 1]));
</script>

<main>
  <div class="inputs-ctn">
    <div class="inputs">
      <Select name="Problem" options={["linear", "wave"]} bind:value={route} />
      <label><input type="checkbox" bind:checked={errorsVisible} /> Show errors</label>
      <Select
        name="Random key"
        options={new Array(10).fill().map((_, i) => i + 1)}
        bind:value={init_key}
      />
      <Range name="Learning rate" mini={0} maxi={lrmax} step={0.01} bind:value={lr} />
      <div class="play-cluster">
        <Player bind:playing {update} {handleClick} />
        <Backward onClick={backward} />
        <Range name="Step" mini={0} maxi={max_step} step={1} bind:value={step} />
      </div>
      <Range name="Momentum" mini={0} maxi={0.99} step={0.01} bind:value={momentum} />
    </div>
  </div>

  <div class="charts-container">
    <div class="chart">
      <LineChart data={res.loss} {step} {refresh} />
    </div>

    <div class="chart">
      <ScatterPred {errorsVisible} predictions={res.predictions[step]} ytrue={y} features={x} />
    </div>
    <div class="chart">
      <Contours {lossBatch} {step} params={res.params} bind:init_params />
    </div>
  </div>
</main>

<style>
  main {
    display: flexbox;
  }
  /* .inputs-ctn {
    text-align: center;
    padding: 1em;
    margin: 1 auto;
    height: 17vh;
    width: 90vw;
    max-width: 400px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  */
  .chart {
    height: 30vh;
    max-width: min(700px, 92vw);
    min-width: 32vw;
    display: block;
    /* margin-left: auto; */
    /* margin-right: auto; */
  }

  .charts-container {
    /* Grid styles */
    display: grid;
    align-items: auto;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    grid-gap: 50px;
    padding: 10px;
    margin: auto;
  }

  .inputs {
    display: grid;
    /* grid-template-columns: 1fr 1fr; */
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    /* border: gray; */
    padding: 10px;
    border-radius: 10px;
  }

  .play-cluster {
    display: block;
    /* display: inline-block; */
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 2px;
  }
</style>
