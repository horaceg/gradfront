<script>
  export let playing;
  export let handleClick;

  function toggle () {
    playing = !playing;
    handleClick()
  }
  export let update

$: playing ? update() : {};
</script>

<button class="button" class:paused={playing} on:click={toggle} />

<style lang="scss">
  .button {
    border: 0;
    background: transparent;
    box-sizing: border-box;
    width: 0;
    height: 37px;

    border-color: transparent transparent transparent #202020;
    transition: 100ms all ease;
    cursor: pointer;

    border-style: solid;
    border-width: 18px 0 18px 30px;
  }

  .button.paused {
    border-style: double;
    border-width: 0px 0 0px 30px;
  }

  .button:hover {
    border-color: transparent transparent transparent #404040;
  }
</style>
