import type { PageData } from '../../$types';
import type { RssItem } from '../../../util/rss-parser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { section, id } = params;
	const parentData = await parent();

	return {
		section,
		id,
		item: extractStory(parentData, section, id)
	};
};

function extractStory(parentData: PageData, section: string, id: string): RssItem | undefined {
	let data: RssItem[] = [];
	if (section === 'news') {
		data = parentData.newsItems;
	} else if (section === 'local') {
		data = parentData.localItems;
	} else if (section === 'opinions') {
		data = parentData.opinionItems;
	} else if (section === 'investigative') {
		data = parentData.investigativeItems;
	} else if (section === 'pop-culture') {
		data = parentData.popCultureItems;
	} else if (section === 'style') {
		data = parentData.styleItems;
	} else if (section === 'sports') {
		data = parentData.sportsItems;
	}
	return data.find((item) => item.id === id);
}
