<script>
  import LineChart from "$lib/LineChart.svelte";
  import Player from "$lib/Player.svelte";
  import Backward from "$lib/Backward.svelte"
  import Range from "$lib/Range.svelte";
  import { regress } from "$lib/regress";
  import ScatterPred from "$lib/ScatterPred.svelte";
  import Select from "$lib/Select.svelte";

  let refresh = 100;
  let playing = false;
  let init_key = 2;
  let lr = 0.63;
  let momentum = 0.75;
  let step = 0;
  let max_step = 30;
  let route = "wave";
  let errorsVisible = true;

  function backward(){
    step = 0; 
    playing = false
  }

  // setTimeout(() => {
  //   playing = true;
  // }, 500);

  function handleClick() {
    if (step == max_step) {
      step = 0;
    }
  }

  function update() {
    if (step == max_step & playing) {
      playing = false;
    } else if (playing) {
      step += 1;
    }
    playing ? setTimeout(update, refresh) : {};
  }

  $: res = regress(route, init_key, lr, momentum, max_step);
  $: lrmax = route == "linear" ? 0.2 : 1.;
  $: lr = Math.min(lrmax, lr)
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
      <Range name="Momentum" mini={0} maxi={.99} step={0.01} bind:value={momentum} />
    </div>
  </div>

  <div class="charts-container">
    <!-- {#if res} -->
    <div class="chart">
      <LineChart data={res.loss} {step} />
    </div>

    <div class="chart">
      <ScatterPred
        {errorsVisible}
        predictions={res.predictions[step]}
        ytrue={res.y}
        features={res.x}
        {refresh}
      />
    </div>
    <!-- {/if} -->
  </div>
</main>

<style>
  * {
    box-sizing: border-box;
  }

  main {
    display: flexbox;
  }
  .inputs-ctn {
    text-align: center;
    /* padding: 1em; */
    /* margin: 1 auto; */
    height: 17vh;
    width: 90vw;
    max-width: 400px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .chart {
    height: 30vh;
    max-width: min(700px, 85vw);
    min-width: 40vw;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  /* 
  .charts-container {
    display: flex;
    flex-direction: row;
  }

  @media (max-width: 800px) {
    .charts-container {
      flex-direction: column;
    }
  }
   */
  .inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* grid-gap: 2px; */
  }

  .play-cluster {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
</style>
