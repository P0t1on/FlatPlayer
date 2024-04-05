import type { PageLoad } from './$types';

export const load: PageLoad = (params) => {
  // if (params.slug === 'hello-world') {
  // 	return {
  // 		title: 'Hello world!',
  // 		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
  // 	};
  // }
  // throw error(404, 'Not found');
};

// https://kit.svelte.dev/docs/page-options#ssr
export const ssr = false;
export const csr = true;
