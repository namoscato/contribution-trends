import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';

export const handle = SvelteKitAuth({
  providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
  callbacks: {
    jwt({ token, account, user, profile }) {
      console.log({ account, user, profile });
      if (account) {
        token.accessToken = account.access_token;
        token.login = profile?.login as string; // TODO leverage GitHubProfile generic
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      session.login = token.login;

      return session;
    }
  }
});
