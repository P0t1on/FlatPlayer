export async function getJson<T>(url: string): Promise<T> {
  return JSON.parse(await (await fetch(url)).text());
}

export async function getSource<T = string>(url: string): Promise<T> {
  return (await (await fetch(url)).text()) as T;
}

export type GithubRepoSearchResponse = {
  total_count: number;
  imcomplete_results: boolean;
  items: {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    score: 1;
    watchers: number;
    private: boolean;
    owner: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: 'User';
      site_admin: boolean;
    };
    html_url: string;
    url: string;
    description: string | null;
    fork: boolean;
    topics: string[];
    stargazers_count: number;
    stargazers_url: string;
  }[];
};

export type GithubRepoSearchResponseHeaderType = {
  'cache-control': string;
  'content-type': string;
  'x-github-media-type': string;
  'x-github-request-id': string;
  'x-ratelimit-limit': string;
  'x-ratelimit-remaining': string;
  'x-ratelimit-reset': string;
  'x-ratelimit-resource': string;
  'x-ratelimit-used': string;
};

const baseTopic = ['flat-survival', 'map'];

export async function searchMap(
  word?: string,
  page = 1,
  per_page = 30,
  ...topics: string[]
): Promise<[GithubRepoSearchResponse, GithubRepoSearchResponseHeaderType]> {
  const response = await fetch(
    `https://api.github.com/search/repositories?per_page=${per_page}&page=${page}&q=${(topics.push(
      ...baseTopic
    ),
    topics)
      .map((v) => `topic%3A${v}`)
      .join('+')}${word ? '+' : ''}${word}`,
    { method: 'GET' }
  );

  const headers: { [key: string]: string } = {};

  for (const k of response.headers.entries()) {
    headers[k[0]] = k[1];
  }

  const json = await response.json();

  return [json, headers as GithubRepoSearchResponseHeaderType];
}
