<script lang="ts">
  import { legalCall, legalDontCall } from '$lib/data/legal';
  export let title: string;
</script>

<details class="category" name="category">
  <summary>▸ {title}</summary>
  <div class="legal-cards">
    <section class="legal-card call">
      <h3>📞 À appeler</h3>
      <ul>
        {#each legalCall as c}
          <li>
            <span class="legal-label">{c.label}</span>
            {#if c.phone}<a class="legal-phone" href={'tel:' + c.phone}>{c.phone}</a>{/if}
            {#if c.note}<span class="legal-note">{c.note}</span>{/if}
          </li>
        {/each}
      </ul>
    </section>

    <section class="legal-card dont-call">
      <h3>⛔ À NE PAS appeler</h3>
      <ul>
        {#each legalDontCall as c}
          <li>
            <span class="legal-label">{c.label}</span>
            {#if c.note}<span class="legal-note">{c.note}</span>{/if}
          </li>
        {/each}
      </ul>
    </section>
  </div>
</details>
