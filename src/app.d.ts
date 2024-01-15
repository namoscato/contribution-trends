// import '@auth/sveltekit';

import type { StreamgraphData } from '$lib/components/Streamgraph/types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      contributions?: Promise<StreamgraphData[]>;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

// import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/jwt' {
  interface JWT {
    accessToken?: string;
    login?: string;
  }
}

declare module '@auth/core/types' {
  interface Session {
    userName?: string;
  }
}

declare module '@auth/sveltekit' {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {}

  interface Session {
    accessToken: string;
    login: string;
  }
}

// import { DefaultSession } from '@auth/core/types';

// declare module '@auth/core/types' {
// 	interface CallbacksOptions {
// 		session: (params: {
// 			session: Session;
// 			/** Available when {@link AuthConfig.session} is set to `strategy: "jwt"` */
// 			token: JWT;
// 		}) => Awaitable<Session | DefaultSession>;
// 	}
// }

export {};
