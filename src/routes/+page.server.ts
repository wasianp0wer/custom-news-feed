import { layoutConfig } from '../config/layout-config';
import type { RssItem } from '../util/rss-parser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	// Access the parent data
	const parentData = await parent();
	let breakingItem: RssItem | undefined = parentData.newsItems[0] ?? null;
	if (Date.now() - breakingItem.pubDate.getTime() > 1000 * 60 * 5 || breakingItem.title.toLowerCase().includes('live')) {
		breakingItem = undefined;
	} else {
		parentData.newsItems.shift();
	}

	return {
		newsItems: parentData.newsItems ?? [],
		localItems: parentData.localItems.slice(0, layoutConfig.localStoryRows * 3) ?? [],
		opinionItems: parentData.opinionItems.slice(0, layoutConfig.expandedOpinionCount) ?? [],
		investigativeItems: parentData.investigativeItems.slice(0, layoutConfig.investigationRows * 3) ?? [],
		popCultureItems: parentData.popCultureItems.slice(0, layoutConfig.cultureRows * 3) ?? [],
		styleItems: parentData.styleItems.slice(0, layoutConfig.styleRows * 3) ?? [],
		sportsItems:
			parentData.sportsItems
				.filter((item) => {
					const desc = item.description.toLowerCase();
					return !desc.includes('how to watch') && !desc.includes('where to watch');
				})
				.slice(0, layoutConfig.sportsRows * 3) ?? [],
		breakingNewsItem: breakingItem
	};
};
