<script>
  import { page } from '$app/stores';
  import Streamgraph from '$lib/components/Streamgraph/Streamgraph.svelte';
</script>

<svelte:head>
  <title>GitHub Contribution Trends</title>
</svelte:head>

{#await $page.data.contributions}
  Loading contributions...
{:then contributions}
  {#if contributions}
    <Streamgraph data={contributions} />
  {/if}
{:catch error}
  Error loading contributions:
  <pre>{error.message}</pre>
{/await}
