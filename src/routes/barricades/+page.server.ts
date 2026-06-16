import { tutorials } from '$lib/data/tutorials';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return { tutorials };
};
