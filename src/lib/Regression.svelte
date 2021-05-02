<script>
  import Backward from "$lib/Backward.svelte";
  import LineChart from "$lib/LineChart.svelte";
  import Player from "$lib/Player.svelte";
  import Range from "$lib/Range.svelte";
  import {
    applyLinear,
    applyNN,
    applyWave,
    initialize,
    initNN,
    make_mse,
    regress,
    setup
  } from "$lib/regress";
  import ScatterPred from "$lib/ScatterPred.svelte";
  import Select from "$lib/Select.svelte";
  import * as tf from "@tensorflow/tfjs";

  console.log(tf.getBackend())
  // tf.setBackend("cpu");

  let init_params = initialize(2);
  let refresh = 100;
  let playing = false;
  let init_key = 2;
  let lr = 0.63;
  let momentum = 0.75;
  let step = 0;
  let max_step = 200;
  let errorsVisible = true;
  let model = "wave";
  let pb = "wave";

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

  const modelMapping = {
    wave: applyWave,
    linear: applyLinear,
    nn: applyNN
  };

  const paramsMapping = {
    wave: { lr: 0.63, momentum: 0.75, lrmax: 2 },
    linear: { lr: 0.15, momentum: 0.75, lrmax: 0.2 },
    nn: { lr: 0.05, momentum: 0.82, lrmax: 0.1 }
  };

  let n = 50;

  $: lr = paramsMapping[model].lr;
  $: momentum = paramsMapping[model].momentum;
  $: lrmax = paramsMapping[model].lrmax;
  $: lr = Math.min(lrmax, lr);
  $: applyProblem = modelMapping[pb];
  $: problem = setup(applyProblem, apply, n);
  $: gradLoss = problem.gradLoss;
  $: xt = problem.xt;
  $: x = xt.arraySync();
  $: yt = problem.yt;
  $: y = yt.arraySync();
  $: apply = modelMapping[model];
  $: res = regress(apply, gradLoss, xt, init_params, lr, momentum, max_step, n);
  $: lossBatch = make_mse(apply, xt, yt.reshape([-1, 1]));
  $: init_params = model != "nn" ? initialize(init_key) : initNN(init_key, xt.shape[1], [3, 3, 3]);
</script>

<main>
  <div class="inputs-ctn">
    <div class="inputs">
      <Select name="Model" options={["linear", "wave", "nn"]} bind:value={model} />
      <Select name="Problem" options={["linear", "wave"]} bind:value={pb} />
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
    <!-- <div class="chart">
      <Contours {lossBatch} {step} params={res.params} bind:init_params />
    </div> -->

    <div class="chart">
      <ScatterPred {errorsVisible} predictions={res.predictions[step]} ytrue={y} features={x} />
    </div>

    <div class="chart">
      <LineChart data={res.loss} {step} {refresh} />
    </div>
  </div>
</main>

<style>
  main {
    display: flexbox;
  }
  .chart {
    height: 30vh;
    max-width: min(700px, 92vw);
    min-width: 32vw;
    display: block;
  }

  .charts-container {
    display: grid;
    align-items: auto;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    grid-gap: 50px;
    padding: 10px;
    margin: auto;
  }
  .inputs-ctn {
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
