import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import { RssParser } from '../util/rss-parser';

type GuardianFeed = {
	media: string;
};

export const load = (async ({ cookies }) => {
	const parser = new RssParser();
	const newsFeed = await parser.parseUrl('https://www.theguardian.com/us/rss');
	const fiftyFirstFeed = await parser.parseUrl('https://51st.news/rss/');
	const guardianOpinionFeed = await parser.parseUrl('https://www.theguardian.com/us/commentisfree/rss');
	const propublicaFeed = await parser.parseUrl('https://theintercept.com/feed/');
	const varietyFeed = await parser.parseUrl('https://variety.com/feed/');
	return {
		newsItems: newsFeed.items,
		localItems: fiftyFirstFeed.items,
		opinionItems: guardianOpinionFeed.items,
		investigativeItems: propublicaFeed.items,
		popCultureItems: varietyFeed.items
	};
}) satisfies PageServerLoad;

export const actions = {} satisfies Actions;
