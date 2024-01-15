import type { StreamgraphData } from '$lib/components/Streamgraph/types';
import { fetchContributions, type ContributionsData } from '$lib/github/fetchContributions';
import { isAfter, startOfYear, subYears } from 'date-fns';
import pLimit from 'p-limit';
import type { PageServerLoad } from './$types';

/** maximum number of GraphQL requests to invoke in parallel */
const GRAPHQL_REQUEST_CONCURRENCY = 5;

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.getSession();
  const contributions = session
    ? fetchAllContributions({ accessToken: session.accessToken })
    : null;

  return {
    session: session?.user ? { login: session.login } : null,
    contributions
  };
};

/**
 * Fetch yearly contribution counts since the user joined.
 */
async function fetchAllContributions({
  accessToken
}: {
  accessToken: string;
}): Promise<StreamgraphData[]> {
  let fromDate = startOfYear(new Date());
  const user = await fetchContributions({
    accessToken,
    from: fromDate
  });

  const contributions = contributionsFromData({
    date: fromDate,
    data: user.contributionsCollection
  });

  const userCreatedDate = new Date(user.createdAt);
  const fromDates: Date[] = [];

  while (isAfter(fromDate, userCreatedDate)) {
    fromDates.push((fromDate = subYears(fromDate, 1)));
  }

  const limit = pLimit(GRAPHQL_REQUEST_CONCURRENCY);
  const promises = fromDates.map<Promise<void>>((from) => {
    return limit(async () => {
      const { contributionsCollection } = await fetchContributions({ accessToken, from });

      contributions.push(
        ...contributionsFromData({
          date: from,
          data: contributionsCollection
        })
      );
    });
  });

  await Promise.all(promises);

  return contributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function contributionsFromData({
  date,
  data
}: {
  date: Date;
  data: ContributionsData;
}): StreamgraphData[] {
  return Object.entries(data).map<StreamgraphData>(([key, count]) => ({
    date: date.toISOString(),
    category: contributionCategoryFromData(key as keyof ContributionsData),
    count
  }));
}

function contributionCategoryFromData(data: keyof ContributionsData): string {
  switch (data) {
    case 'totalIssueContributions':
      return 'Issues';
    case 'totalPullRequestContributions':
      return 'Pull requests';
    case 'totalCommitContributions':
      return 'Commits';
    case 'totalPullRequestReviewContributions':
      return 'Code review';
    default:
      assertNever(data);
  }
}

function assertNever(data: never): never {
  throw new Error(`Unexpected data: ${data}`);
}
