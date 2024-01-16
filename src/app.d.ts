import type { StreamgraphData } from '$lib/components/Streamgraph/types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface PageData {
      contributions?: Promise<StreamgraphData[]>;
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    accessToken?: string;
    login?: string;
  }
}

declare module '@auth/core/types' {
  interface Session {
    accessToken?: string;
    login?: string;
  }
}

export {};
