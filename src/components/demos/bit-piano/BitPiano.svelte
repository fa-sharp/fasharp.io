<script lang="ts">
  /**
   * Generated metadata for 12 piano keys (one octave). Each piano key is given a unique
   * bitmask value that's a power of 2, starting with 4096 (2 ^ 12) and descending.
   *
   * For example: `[ { name: "C", value: 4096 }, { name: "C# Db", value: 2048 }, ... ]`
   */
  const KEYS = Object.freeze(
    ["C", "C# Db", "D", "D# Eb", "E", "F", "F# Gb", "G", "G# Ab", "A", "A# Bb", "B", "C"].map(
      (name, idx) => ({ name, value: 2 ** (12 - idx) }),
    ),
  );
  const KEY_INDEXES = Object.freeze([...KEYS.keys()]);
  const BLACK_KEY_INDEXES = Object.freeze([1, 3, 6, 8, 10]);

  /** The "bit field" integer that represents the state of all keys */
  let state = $state(0);
  const stateBinary = $derived(state.toString(2).padStart(13, "0"));

  /** Event handlers */
  function onKeyDown(keyIndex: number) {
    state = state | KEYS[keyIndex].value; // OR (|) operator will set this key's bit to 1
  }
  function onKeyUp(keyIndex: number) {
    state = state & ~KEYS[keyIndex].value; // AND (&) and NOT (~) operators will set this key's bit to 0
  }
  function onKeyToggle(keyIndex: number) {
    state = state ^ KEYS[keyIndex].value; // XOR (^) operator will toggle this key's bit between 0 and 1
  }

  /** Interval/chord detector */
  const { isHalfStep, isWholeStep, isPerfectFifth, isMajorTriad, isMinorTriad } = $derived.by(
    () => {
      let shiftedState = state;
      // shift all bits to the right until we get a 1
      while (shiftedState !== 0 && (shiftedState & 1) === 0) {
        shiftedState >>= 1;
      }
      // check the shifted bits for patterns that indicate certain intervals & chords
      return {
        isHalfStep: shiftedState === 0b11,
        isWholeStep: shiftedState === 0b101,
        isPerfectFifth: shiftedState === 0b10000001,
        isMajorTriad: shiftedState === 0b10001001,
        isMinorTriad: shiftedState === 0b10010001,
      };
    },
  );
</script>

<div class="wrapper">
  <div class="keyboard">
    <div>
      {#each KEY_INDEXES as keyIndex (keyIndex)}
        <!-- AND (&) operator to check if key is played -->
        {@const isKeyPlayed = state & KEYS[keyIndex].value}
        <button
          onclick={() => (isKeyPlayed ? onKeyUp(keyIndex) : onKeyDown(keyIndex))}
          class="key"
          class:played={isKeyPlayed}
          class:black={BLACK_KEY_INDEXES.includes(keyIndex)}
          class:white={!BLACK_KEY_INDEXES.includes(keyIndex)}
        >
          <span class="key-label">{KEYS[keyIndex].name}</span>
        </button>
      {/each}
    </div>
  </div>
  <div class="bits">
    <b>Note</b>
    {#each KEY_INDEXES as idx}
      <div>{KEYS[idx].name}</div>
    {/each}
    <b>Bit</b>
    {#each [...stateBinary] as bit, idx}
      <button class:selected={state & KEYS[idx].value} onclick={() => onKeyToggle(idx)}>
        {bit}
      </button>
    {/each}
  </div>
  <div>Binary state (base 2): {stateBinary}</div>
  <div>Integer state (base 10): {state}</div>
  <div>Half step: {isHalfStep ? "✅" : "❌"}</div>
  <div>Whole step: {isWholeStep ? "✅" : "❌"}</div>
  <div>Perfect fifth: {isPerfectFifth ? "✅" : "❌"}</div>
  <div>Major triad: {isMajorTriad ? "✅" : "❌"}</div>
  <div>Minor triad: {isMinorTriad ? "✅" : "❌"}</div>
</div>

<style lang="scss">
  .wrapper {
    --selected: hsl(189, 56%, 54%);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    overflow: auto;
  }

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font: inherit;
    color: currentColor;

    &:focus-visible {
      outline-offset: 2px;
      outline-color: rgb(248, 99, 30);
    }
  }

  .bits {
    display: grid;
    grid-template-columns: 2fr repeat(13, 1fr);
    max-width: 600px;
    border-top: solid 1px currentColor;
    border-left: solid 1px currentColor;

    & > * {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      border-bottom: solid 1px currentColor;
      border-right: solid 1px currentColor;
      min-width: 2.4rem;
      padding: 4px;

      &.selected {
        background-color: var(--selected);
      }
    }
  }

  .keyboard {
    display: flex;

    & > div {
      display: flex;
      overflow: auto;
      height: 11rem;
      padding: 6px;
    }
  }

  .key {
    --key-width: var(--mod-key-width, 45px);
    flex-shrink: 0;
    width: var(--key-width);
    min-width: min-content;

    border-bottom-left-radius: calc(var(--key-width) / 8);
    border-bottom-right-radius: calc(var(--key-width) / 8);

    -webkit-user-drag: none;
    user-select: none;
    transition:
      box-shadow 100ms,
      background-color 100ms;

    display: flex;
    justify-content: center;

    & > .key-label {
      align-self: flex-end;
      font-size: 0.9em;
    }

    &.black {
      height: 65%;
      --adjusted-width: calc(var(--key-width) * 0.7);
      width: var(--adjusted-width);

      margin: 0px calc(var(--adjusted-width) / -2) 0px calc(var(--adjusted-width) / -2);
      z-index: 2;
      background: black;
      box-shadow: hsl(0, 0%, 35%) 0px 2px 2px;

      & > .key-label {
        color: white;
      }

      &.played {
        background: var(--selected);
        box-shadow: inset black 0px 0px 2px 0px;
      }
    }

    &.white {
      height: 100%;
      width: var(--key-width);

      background: white;
      box-shadow:
        inset black 0px 0px 1px 0px,
        black 0px 3px 2px 0px;

      & > .key-label {
        color: black;
      }

      &.played {
        background: var(--selected);
        box-shadow: inset black 0px 0px 2px 0px;
      }
    }
  }
</style>
