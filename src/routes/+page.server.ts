import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import { RssParser, type RssPage } from '../util/rss-parser';

const cache = new Map<string, RssPage>();
let lastCacheUpdate: Date | undefined = undefined;

export const load = (async ({ cookies }) => {
	if (!lastCacheUpdate || lastCacheUpdate.getTime() + 60000 < Date.now()) {
		lastCacheUpdate = new Date();
		cache.clear();
		const parser = new RssParser();
		await Promise.all([
			parser.parseUrl('https://www.theguardian.com/us/rss').then((rss) => {
				cache.set(CacheSource.NEWS, rss);
			}),
			parser.parseUrl('https://51st.news/rss/').then((rss) => {
				cache.set(CacheSource.LOCAL, rss);
			}),
			parser.parseUrl('https://www.theguardian.com/us/commentisfree/rss').then((rss) => {
				cache.set(CacheSource.OPINION, rss);
			}),
			parser.parseUrl('https://theintercept.com/feed/').then((rss) => {
				cache.set(CacheSource.INVESTIGATIVE, rss);
			}),
			parser.parseUrl('https://variety.com/feed/').then((rss) => {
				cache.set(CacheSource.POP_CULTURE, rss);
			})
		]);
	}
	const newsFeed = cache.get(CacheSource.NEWS);
	const fiftyFirstFeed = cache.get(CacheSource.LOCAL);
	const guardianOpinionFeed = cache.get(CacheSource.OPINION);
	const propublicaFeed = cache.get(CacheSource.INVESTIGATIVE);
	const varietyFeed = cache.get(CacheSource.POP_CULTURE);
	return {
		newsItems: newsFeed?.items ?? [],
		localItems: fiftyFirstFeed?.items ?? [],
		opinionItems: guardianOpinionFeed?.items ?? [],
		investigativeItems: propublicaFeed?.items ?? [],
		popCultureItems: varietyFeed?.items ?? []
	};
}) satisfies PageServerLoad;

export const actions = {} satisfies Actions;

enum CacheSource {
	NEWS = 'news',
	LOCAL = 'local',
	OPINION = 'opinion',
	INVESTIGATIVE = 'investigative',
	POP_CULTURE = 'popCulture'
}
