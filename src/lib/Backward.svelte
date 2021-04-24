<script>
  export let onClick;
</script>

<button class="button" on:click={onClick} />

<style>
  .button {
    border: 0;
    background: black;
    box-sizing: border-box;
    width: 37px;
    height: 37px;
    cursor: pointer;
  }

  .button:hover {
    background: transparent transparent transparent #404040;
  }
</style>
