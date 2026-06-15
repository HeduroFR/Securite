<script lang="ts">
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<svelte:head>
  <title>F*CK RIPOST</title>
</svelte:head>

<main class="login">
  <h1>F*CK RIPOST</h1>
  <p>Accès réservé. Entre le code.</p>
  <form method="POST">
    <input type="password" name="passcode" placeholder="Code d'accès" autocomplete="off" required />
    <button type="submit">Entrer</button>
    {#if form?.error}<p class="error">{form.error}</p>{/if}
  </form>
</main>
