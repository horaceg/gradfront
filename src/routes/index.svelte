<script>
  import { browser } from "$app/env";
  import LineChart from "$lib/LineChart.svelte";
  import Player from "$lib/Player.svelte";
  import Range from "$lib/Range.svelte";
  import ScatterPred from "$lib/ScatterPred.svelte";
  import Select from "$lib/Select.svelte";

  let refresh = 100;
  let playing = false;
  let init_key = 1;
  let lr = 0.1;
  let momentum = 0.2;
  let step = 0;
  let max_step = 29;
  let res;

  function handleClick () {
    if (step == max_step) {
      step = 0;
    }
  }

  function update() {
    if (step == max_step) {
      playing = false;
    } else {
      step += 1;
    }
    playing ? setTimeout(update, refresh) : {};
  }
  
  $: descendUrl = `https://gradapi.fly.dev/linear?init_key=${init_key}&lr=${lr}&momentum=${momentum}`;
  $: browser
    ? fetch(descendUrl)
        .then((response) => response.json())
        .then((data) => (res = data))
        .catch((error) => console.log(error))
    : {};
</script>

<main class="inputs-ctn">
  <div class="inputs">
    <!-- <Select
      name="Random key"
      options={new Array(10).fill().map((_, i) => i + 1)}
      bind:value={init_key}
    /> -->
    <Range name="Step" mini={0} maxi={max_step} step={1} bind:value={step} />
    <Range name="Learning rate" mini={0} maxi={1} step={0.02} bind:value={lr} />
    <Player bind:playing={playing} {update} {handleClick}/>
    <Range name="Momentum" mini={0} maxi={0.95} step={0.02} bind:value={momentum} />
  </div>
</main>


{#if res}
  <div class="chart">
    <LineChart data={res.loss} {step} />
  </div>

  <div class="chart">
    <ScatterPred predictions={res.predictions[step]} ytrue={res.y} features={res.x} {refresh}/>
  </div>
{/if}

<style>
  main {
    text-align: center;
    /* padding: 1em; */
    /* margin: 0 auto; */
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

  .inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* grid-gap: 2px; */
  }
</style>
