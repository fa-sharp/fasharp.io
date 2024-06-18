<script>
  const LENGTH = 8;
  const INDEXES = [...new Array(LENGTH).keys()].reverse();

  let state = $state(5);
  const stateBinary = $derived(state.toString(2).padStart(LENGTH, "0"));
</script>

<p>
  <b>Base 10 number</b>: {state}
  <br />
  <b>Base 2 (binary)</b>: {stateBinary}
</p>
<div class="bits">
  <b>Power of 2</b>
  {#each INDEXES as idx}
    <div>
      {idx}
    </div>
  {/each}
  <b>Bit</b>
  {#each [...stateBinary] as bit, idx}
    <button onclick={() => (state ^= 2 ** (LENGTH - 1 - idx))} class:selected={bit === "1"}>
      {bit}
    </button>
  {/each}
</div>

<style lang="scss">
  .bits {
    display: grid;
    grid-template-columns: 3fr repeat(8, 1fr);
    max-width: 500px;
    border-top: solid 1px currentColor;
    border-left: solid 1px currentColor;

    button {
      font: inherit;
      cursor: pointer;
    }

    & > * {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      background: none;
      color: inherit;
      border: none;
      border-bottom: solid 1px currentColor;
      border-right: solid 1px currentColor;
      min-width: 2.4rem;
      padding: 4px;

      &.selected {
        background-color: hsl(189, 56%, 54%);
      }
    }
  }
</style>
