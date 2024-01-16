<script>
  import { page } from '$app/stores';
  import Header from '$lib/components/Header/Header.svelte';
  import '../app.css';
</script>

<Header login={$page.data.session?.login ?? null} />

<main>
  <slot />
</main>

<style>
  main {
    padding: 1em;
  }
</style>
