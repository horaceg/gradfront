<script>
  export let value;
  export let name;
  export let options;
</script>

<div>
  <label for="{name}-select">{name}</label>
  <select {name} id="{name}-select" bind:value>
    {#each options as option}
      <option value="{option}">{option}</option>
    {/each}
  </select>
</div>
