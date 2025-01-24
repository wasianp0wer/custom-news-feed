import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import { RssParser, type RssItem, type RssPage } from '../util/rss-parser';
import { layoutConfig } from '../config/layout-config';

const cache = new Map<string, RssPage>();
let lastCacheUpdate: Date | undefined = undefined;

export const load = (async ({ cookies }) => {
	if (!lastCacheUpdate || lastCacheUpdate.getTime() + 60000 < Date.now()) {
		lastCacheUpdate = new Date();
		cache.clear();
		const parser = new RssParser();
		await Promise.all([
			await Promise.all([
				parser.parseUrl('https://www.theguardian.com/us/rss'),
				parser.parseUrl('https://51st.news/rss/'),
				parser.parseUrl('https://www.arlnow.com/feed/'),
				parser.parseUrl('https://www.ffxnow.com/feed/')
			]).then(([guardian, fiftyFirst, arlNow, ffxNow]) => {
				cache.set(CacheSource.NEWS, guardian);
				const localGuardian = {
					...guardian,
					items: guardian.items.filter((item) => item.categories.includes('Washington DC'))
				};
				cache.set(CacheSource.LOCAL, sortMultipleSources(24, localGuardian, fiftyFirst, arlNow, ffxNow));
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
	const localFeed = cache.get(CacheSource.LOCAL);
	const guardianOpinionFeed = cache.get(CacheSource.OPINION);
	const propublicaFeed = cache.get(CacheSource.INVESTIGATIVE);
	const varietyFeed = cache.get(CacheSource.POP_CULTURE);
	return {
		newsItems: newsFeed?.items ?? [],
		localItems: localFeed?.items.slice(0, layoutConfig.localStoryRows * 3) ?? [],
		opinionItems: guardianOpinionFeed?.items.slice(0, layoutConfig.expandedOpinionCount) ?? [],
		investigativeItems: propublicaFeed?.items.slice(0, layoutConfig.investigationRows * 3) ?? [],
		popCultureItems: varietyFeed?.items.slice(0, layoutConfig.styleRows * 3) ?? []
	};
}) satisfies PageServerLoad;

export const actions = {} satisfies Actions;

function sortMultipleSources(tooOldThresholdHours: number, ...sources: RssPage[]): RssPage {
	console.log('sources', sources);
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
