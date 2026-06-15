<script lang="ts">
  import type { PageData } from './$types';
  import Disclaimer from '$lib/components/Disclaimer.svelte';
  import CategorySection from '$lib/components/CategorySection.svelte';
  export let data: PageData;
</script>

<svelte:head>
  <title>Se Protéger — Protection en manifestation</title>
  <meta name="description" content="Recommandations de matériel de protection individuelle en manifestation : yeux, voies respiratoires, tête, corps, mains, premiers soins." />
</svelte:head>

<header class="hero">
  <h1>SE PROTÉGER</h1>
  <p class="sub">Liste de matériel de protection en manifestation.</p>
  <Disclaimer />
</header>

<main class="categories">
  {#each data.categories as category}
    <CategorySection {category} />
  {/each}
</main>

<footer class="foot">
  <p class="foot-title">SE PROTÉGER</p>
  <p>Dernière mise à jour : <time datetime="2026-06-15">15 juin 2026</time></p>
</footer>
