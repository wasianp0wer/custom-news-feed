import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import { RssParser } from '../util/rss-parser';

type GuardianFeed = {
	media: string;
};

export const load = (async ({ cookies }) => {
	const parser = new RssParser();
	const feed = await parser.parseUrl('https://www.theguardian.com/us/commentisfree/rss');
	console.log(Object.keys(feed));
	console.log(feed.items[0]);
	return {
		story: feed.items[0].description,
		title: feed.items[0].title,
		author: feed.items[0].dc_creator,
		media: feed.items[0].media_content
	};
}) satisfies PageServerLoad;

export const actions = {} satisfies Actions;
