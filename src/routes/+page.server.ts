import type { PageServerLoad } from "./$types";

export const load = (async (params) => {
  return {};
  // if (params.slug === 'hello-world') {
  // 	return {
  // 		title: 'Hello world!',
  // 		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
  // 	};
  // }

  // throw error(404, 'Not found');
}) satisfies PageServerLoad;

export const ssr = false;
export const csr = true;
