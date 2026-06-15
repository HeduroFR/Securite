<script lang="ts">
  import type { Category } from '$lib/data/categories';
  import ItemCard from './ItemCard.svelte';
  export let category: Category;
</script>

<details class="category" name="categorie">
  <summary>▸ {category.title}</summary>
  <div class="items">
    {#each category.items as item}
      <ItemCard {item} />
    {/each}
  </div>
</details>
