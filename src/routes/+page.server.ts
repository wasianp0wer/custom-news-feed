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
	const localFeed = await parser.parseUrl('https://51st.news/rss/');
	const opinionFeed = await parser.parseUrl('https://www.theguardian.com/us/commentisfree/rss');
	return {
		newsItems: newsFeed.items,
		localItems: localFeed.items,
		opinionItems: opinionFeed.items
	};
}) satisfies PageServerLoad;

export const actions = {} satisfies Actions;
