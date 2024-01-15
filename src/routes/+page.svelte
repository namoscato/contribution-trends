<script>
  import { page } from '$app/stores';
  import Streamgraph from '$lib/components/Streamgraph/Streamgraph.svelte';
</script>

{#await $page.data.contributions}
  Loading contributions...
{:then contributions}
  {#if contributions}
    <Streamgraph data={contributions} />
  {/if}
{:catch error}
  <p>error loading contributions: {error.message}</p>
{/await}
