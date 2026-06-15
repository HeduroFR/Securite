import { categories } from '$lib/data/categories';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return { categories };
};
