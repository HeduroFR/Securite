<script lang="ts">
  import type { PageData } from './$types';
  import Disclaimer from '$lib/components/Disclaimer.svelte';
  import CategorySection from '$lib/components/CategorySection.svelte';
  export let data: PageData;
</script>

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
  <Disclaimer />
  <p>Dernière mise à jour : 2026-06-15</p>
</footer>
