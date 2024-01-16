import { graphql } from '@octokit/graphql';
import type { ContributionsCollection, User } from '@octokit/graphql-schema';

export interface UserData extends Pick<User, 'createdAt'> {
  contributionsCollection: ContributionsData;
}

export type ContributionsData = Pick<
  ContributionsCollection,
  | 'totalIssueContributions'
  | 'totalPullRequestContributions'
  | 'totalCommitContributions'
  | 'totalPullRequestReviewContributions'
>;

export async function fetchContributions({
  accessToken,
  from
}: {
  accessToken: string;
  from: Date;
}): Promise<UserData> {
  const { viewer } = await graphql<{
    viewer: User;
  }>(
    `
      query ($from: DateTime!) {
        viewer {
          createdAt
          contributionsCollection(from: $from) {
            totalIssueContributions
            totalPullRequestContributions
            totalCommitContributions
            totalPullRequestReviewContributions
          }
        }
      }
    `,
    {
      from,
      headers: {
        authorization: `token ${accessToken}`
      }
    }
  );

  return viewer;
}
