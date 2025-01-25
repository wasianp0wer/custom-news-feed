import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	// Access the parent data
	const { popCultureItems } = await parent();

	return { popCultureItems };
};
