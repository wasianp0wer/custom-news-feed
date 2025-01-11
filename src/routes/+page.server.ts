import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import { RssParser } from '../util/rss-parser';

type GuardianFeed = {
	media: string;
};

export const load = (async ({ cookies }) => {
	const parser = new RssParser();
	const feed = await parser.parseUrl('https://www.theguardian.com/us/rss');
	return {
		items: feed.items
	};
}) satisfies PageServerLoad;

export const actions = {} satisfies Actions;
