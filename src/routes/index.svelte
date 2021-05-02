<script>
  import Regression from "$lib/Regression.svelte";
  import { setBackend } from "@tensorflow/tfjs";
  import "@tensorflow/tfjs-backend-wasm";
</script>

<svelte:head>
  <title>Interactive gradient descent</title>
</svelte:head>

{#await setBackend("wasm") then _}
  <Regression />
{/await}
