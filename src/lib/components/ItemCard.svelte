<script lang="ts">
  import type { Item } from '$lib/data/categories';
  export let item: Item;
</script>

<article class="item">
  <h3>{item.name}</h3>
  <dl>
    <dt>Exemple</dt><dd>{item.example}</dd>
    <dt>À chercher</dt><dd>{item.spec}</dd>
    {#if item.priceApprox}<dt>Prix</dt><dd>{item.priceApprox}</dd>{/if}
    {#if item.note}<dt>Note</dt><dd>{item.note}</dd>{/if}
  </dl>
  {#if item.buyLink}<a class="buy" href={item.buyLink} target="_blank" rel="noopener">Lien d'achat</a>{/if}
</article>
