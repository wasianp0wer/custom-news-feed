import { layoutConfig } from '../config/layout-config';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	// Access the parent data
	const parentData = await parent();

	return {
		newsItems: parentData.newsItems ?? [],
		localItems: parentData.localItems.slice(0, layoutConfig.localStoryRows * 3) ?? [],
		opinionItems: parentData.opinionItems.slice(0, layoutConfig.expandedOpinionCount) ?? [],
		investigativeItems: parentData.investigativeItems.slice(0, layoutConfig.investigationRows * 3) ?? [],
		popCultureItems: parentData.popCultureItems.slice(0, layoutConfig.cultureRows * 3) ?? [],
		styleItems: parentData.styleItems.slice(0, layoutConfig.styleRows * 3) ?? []
	};
};
