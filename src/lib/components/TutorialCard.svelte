<script lang="ts">
  import type { Tutorial } from '$lib/data/tutorials';
  export let tutorial: Tutorial;

  let index = 0;
  let mode: 'photos' | 'video' = 'photos';
  const count = tutorial.slides.length;

  function prev() {
    if (index > 0) index -= 1;
  }
  function next() {
    if (index < count - 1) index += 1;
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }

  let touchX = 0;
  function onTouchStart(e: TouchEvent) {
    touchX = e.changedTouches[0].clientX;
  }
  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchX;
    if (dx > 40) prev();
    else if (dx < -40) next();
  }

  // lecteur vidéo custom
  let videoEl: HTMLVideoElement;
  let playerEl: HTMLDivElement;
  let paused = true;
  let muted = false;
  let currentTime = 0;
  let duration = 0;

  function togglePlay() {
    if (videoEl.paused) videoEl.play();
    else videoEl.pause();
  }
  function fmt(t: number) {
    if (!t || !isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else playerEl?.requestFullscreen?.();
  }
</script>

<article class="tuto">
  <h3>{tutorial.title}</h3>
  {#if tutorial.intro}<p class="tuto-intro">{tutorial.intro}</p>{/if}

  <h4>Matériel</h4>
  <ul class="materials">
    {#each tutorial.materials as m}
      <li>{m}</li>
    {/each}
  </ul>

  {#if tutorial.videoUrl}
    <div class="switch" role="tablist" aria-label="Mode d'affichage">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'photos'}
        class:active={mode === 'photos'}
        on:click={() => (mode = 'photos')}
      >Photos</button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'video'}
        class:active={mode === 'video'}
        on:click={() => (mode = 'video')}
      >Vidéo</button>
    </div>
  {/if}

  {#if mode === 'photos'}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex a11y_no_noninteractive_element_interactions -->
    <div
      class="carousel"
      role="group"
      aria-roledescription="carrousel"
      aria-label="Étapes {tutorial.title}"
      tabindex="0"
      on:keydown={onKey}
      on:touchstart={onTouchStart}
      on:touchend={onTouchEnd}
    >
      <img
        src={tutorial.slides[index]}
        alt="{tutorial.title} — étape {index + 1} sur {count}"
        loading="lazy"
      />
      <div class="controls">
        <button type="button" on:click={prev} disabled={index === 0} aria-label="Étape précédente">◂</button>
        <span class="counter">{index + 1}/{count}</span>
        <button type="button" on:click={next} disabled={index === count - 1} aria-label="Étape suivante">▸</button>
      </div>
    </div>
  {:else}
    <div class="player" bind:this={playerEl}>
      <!-- svelte-ignore a11y_media_has_caption a11y_no_noninteractive_element_interactions -->
      <video
        bind:this={videoEl}
        src={tutorial.videoUrl}
        playsinline
        preload="metadata"
        bind:paused
        bind:muted
        bind:currentTime
        bind:duration
        on:click={togglePlay}
      >
        Ton navigateur ne peut pas lire cette vidéo.
      </video>

      <div class="vcontrols">
        <button type="button" class="vbtn" on:click={togglePlay} aria-label={paused ? 'Lire' : 'Pause'}>
          {paused ? '►' : '❚❚'}
        </button>

        <input
          class="seek"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          bind:value={currentTime}
          aria-label="Progression"
          style="--p:{duration ? (currentTime / duration) * 100 : 0}%"
        />

        <span class="vtime">{fmt(currentTime)} / {fmt(duration)}</span>

        <button type="button" class="vbtn" class:muted on:click={() => (muted = !muted)} aria-label={muted ? 'Activer le son' : 'Couper le son'}>
          ♪
        </button>
        <button type="button" class="vbtn" on:click={toggleFullscreen} aria-label="Plein écran">⛶</button>
      </div>
    </div>
  {/if}
</article>

<style>
  .tuto {
    background: var(--black);
    color: var(--orange);
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  .tuto h3 {
    margin: 0 0 0.5rem;
    text-transform: uppercase;
    font-size: 1.4rem;
  }
  .tuto-intro {
    font-weight: 400;
    margin: 0 0 1rem;
  }
  .tuto h4 {
    margin: 0 0 0.5rem;
    text-transform: uppercase;
    font-size: 0.8rem;
    opacity: 0.7;
  }
  .materials {
    margin: 0 0 1rem;
    padding-left: 1.1rem;
    font-weight: 400;
    display: grid;
    gap: 0.25rem;
  }
  .carousel {
    outline: none;
  }
  .carousel:focus-visible {
    outline: 3px solid var(--yellow);
  }
  .carousel img {
    width: 100%;
    height: auto;
    display: block;
    background: #000;
  }
  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  .controls button {
    background: var(--orange);
    color: var(--black);
    border: none;
    font-size: 1.2rem;
    font-weight: 700;
    width: 2.4rem;
    height: 2.4rem;
    cursor: pointer;
  }
  .controls button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .counter {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .switch {
    display: inline-flex;
    margin-bottom: 0.75rem;
    border: 2px solid var(--orange);
  }
  .switch button {
    background: transparent;
    color: var(--orange);
    border: none;
    padding: 0.4rem 1rem;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    cursor: pointer;
  }
  .switch button.active {
    background: var(--orange);
    color: var(--black);
  }
  .player {
    position: relative;
    display: flex;
    justify-content: center;
    background: #000;
  }
  .player video {
    display: block;
    width: auto;
    max-width: 100%;
    max-height: 75vh;
    background: #000;
    cursor: pointer;
  }
  .vcontrols {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--black);
    border-top: 3px solid var(--orange);
  }
  .player:fullscreen { align-items: center; }
  .player:fullscreen video { max-height: 100vh; }
  .vbtn {
    flex: none;
    background: var(--orange);
    color: var(--black);
    border: none;
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
    line-height: 1;
    font-weight: 700;
    cursor: pointer;
  }
  .vbtn.muted {
    text-decoration: line-through;
    opacity: 0.7;
  }
  .vtime {
    flex: none;
    color: var(--orange);
    font-weight: 700;
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
  }
  /* barre de progression DA : remplissage orange sur piste noire */
  .seek {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 8px;
    background: linear-gradient(var(--orange), var(--orange)) 0 / var(--p, 0%) 100% no-repeat,
      #555;
    cursor: pointer;
    border: 2px solid var(--orange);
  }
  .seek::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: var(--yellow);
    border: 2px solid var(--black);
    cursor: pointer;
  }
  .seek::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: var(--yellow);
    border: 2px solid var(--black);
    border-radius: 0;
    cursor: pointer;
  }
</style>
