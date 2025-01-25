import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	// Access the parent data
	const { opinionItems } = await parent();

	return { opinionItems };
};
