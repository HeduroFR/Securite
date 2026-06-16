<script lang="ts">
  import { page } from '$app/stores';
  $: path = $page.url.pathname;
</script>

<nav class="sitenav" aria-label="Navigation principale">
  <a href="/" class:active={path === '/'} aria-current={path === '/' ? 'page' : undefined}>Protection</a>
  <a href="/barricades" class:active={path === '/barricades'} aria-current={path === '/barricades' ? 'page' : undefined}>Barricades</a>
</nav>

<style>
  .sitenav {
    display: inline-flex;
    margin: 0.75rem 0 1.25rem;
    border: 3px solid var(--orange);
  }
  .sitenav a {
    padding: 0.45rem 1.1rem;
    color: var(--orange);
    text-decoration: none;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.9rem;
  }
  .sitenav a + a {
    border-left: 3px solid var(--orange);
  }
  .sitenav a.active {
    background: var(--orange);
    color: var(--black);
  }
</style>
