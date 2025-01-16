import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import { RssParser, type RssItem, type RssPage } from '../util/rss-parser';

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
			await Promise.all([
				parser.parseUrl('https://51st.news/rss/'),
				parser.parseUrl('https://www.arlnow.com/feed/'),
				parser.parseUrl('https://www.ffxnow.com/feed/')
			]).then(([fiftyFirst, arlNow, ffxNow]) => {
				cache.set(CacheSource.LOCAL, sortMultipleSources(24, fiftyFirst, arlNow, ffxNow));
			}),
			await Promise.all([
				parser.parseUrl('https://www.theguardian.com/us/commentisfree/rss')
				// parser.parseUrl('https://jacobin.com/feed/')
			]).then(([guardian]) => {
				cache.set(CacheSource.OPINION, sortMultipleSources(6, guardian));
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

function sortMultipleSources(tooOldThresholdHours: number, ...sources: RssPage[]): RssPage {
	const total: RssItem[] = [];
	let thisRound: RssItem[] = [];
	while (sources.find((source) => source.items.length > 0)) {
		for (let source of sources) {
			if (source.items.length > 0) {
				thisRound.push(source.items.shift()!);
			}
		}
		thisRound.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
		if (thisRound.length === 0) {
			break;
		}
		const first = thisRound.shift()!;
		total.push(first);
		for (let item of thisRound) {
			if (first.pubDate.getTime() < item.pubDate.getTime() + tooOldThresholdHours * 3600000) {
				total.push(item);
			}
		}
		thisRound = thisRound.filter((item) => !total.includes(item));
	}
	return { items: total } as RssPage;
}

enum CacheSource {
	NEWS = 'news',
	LOCAL = 'local',
	OPINION = 'opinion',
	INVESTIGATIVE = 'investigative',
	POP_CULTURE = 'popCulture'
}
