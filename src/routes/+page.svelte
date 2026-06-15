<script lang="ts">
  import type { PageData } from './$types';
  import Disclaimer from '$lib/components/Disclaimer.svelte';
  import CategorySection from '$lib/components/CategorySection.svelte';
  import LegalSection from '$lib/components/LegalSection.svelte';
  export let data: PageData;
</script>

<svelte:head>
  <title>F*CK RIPOST - Protection en manifestation</title>
  <meta name="description" content="Recommandations de matériel de protection individuelle en manifestation : yeux, voies respiratoires, tête, corps, mains, premiers soins." />
</svelte:head>

<header class="hero">
  <h1>F*CK RIPOST - Se Protéger</h1>
  <p class="sub">Liste de matériel de protection en manifestation (non-exhaustive)</p>
  <Disclaimer />
</header>

<main class="categories">
  {#each data.categories as category}
    {#if category.id === 'legal'}
      <LegalSection title={category.title} />
    {:else}
      <CategorySection {category} />
    {/if}
  {/each}
</main>

<footer class="foot">
  <p class="foot-title">F*CK RIPOST</p>
  <p>Dernière mise à jour : <time datetime="2026-06-16">16 juin 2026</time></p>
</footer>
