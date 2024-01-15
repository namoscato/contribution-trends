<script lang="ts">
  import type { Session } from '@auth/sveltekit';
  import { signIn, signOut } from '@auth/sveltekit/client';
  import GitHubMark from './GithubMark.svelte';

  export let session: Session | null;
</script>

<header>
  <div class="title">
    <GitHubMark height={32} />
    <h1 class:thin={session}>Contribution Trends</h1>
    {#if session}
      <span class="separator">/</span>
      <h2>{session.login}</h2>
    {/if}
  </div>
  {#if session}
    <button on:click={() => signOut()}>Sign out</button>
  {:else}
    <button on:click={() => signIn('github')}>Sign in</button>
  {/if}
</header>

<style>
  header {
    background-color: #e6ebee;
    border-bottom: 1px solid #d0d7dd;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }

  .title {
    align-items: center;
    display: flex;
  }

  h1,
  h2 {
    font-size: inherit;
    font-weight: 600;
    margin: 0;
  }

  h1 {
    margin-left: 0.8em;
  }

  .thin {
    font-weight: 400;
  }

  .separator {
    margin: 0 0.6em;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    padding: 0;
  }
</style>
