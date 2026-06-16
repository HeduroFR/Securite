<script lang="ts">
  import type { PageData } from './$types';
  import TutorialCard from '$lib/components/TutorialCard.svelte';
  import SiteNav from '$lib/components/SiteNav.svelte';
  export let data: PageData;
</script>

<svelte:head>
  <title>F*CK RIPOST - Construction & barricades</title>
  <meta name="description" content="Tutos illustrés de fabrication de barricades : matériel nécessaire, étapes en images et vidéo." />
</svelte:head>

<header class="hero">
  <h1>F*CK RIPOST - Barricades</h1>
  <p class="sub">Tutos de construction (illustrations + vidéo)</p>
  <SiteNav />
</header>

<main class="categories">
  {#each data.tutorials as tutorial}
    <TutorialCard {tutorial} />
  {/each}
</main>

<footer class="foot">
  <p class="foot-title">F*CK RIPOST</p>
</footer>

