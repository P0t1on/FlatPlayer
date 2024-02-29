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
    description: string | null;
    fork: boolean;
  }[];
};

export async function searchMap(page = 1, per_page = 30) {
  const json = (await (
    await fetch(
      `https://api.github.com/search/repositories?per_page=${per_page}&page=${page}&q=topic%3Aflat-survival+topic%3Amap`,
      { method: 'GET' }
    )
  ).json()) as GithubRepoSearchResponse;

  return json;
}
