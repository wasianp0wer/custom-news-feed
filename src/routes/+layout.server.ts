import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions, LayoutServerLoad } from './$types';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import { RssParser, type RssItem, type RssPage } from '../util/rss-parser';
import { layoutConfig } from '../config/layout-config';
import { StoryUtil } from '../util/story.util';

const cache = new Map<string, RssPage>();
let lastCacheUpdate: Date | undefined = undefined;

export const load = (async ({ cookies }) => {
	if (!lastCacheUpdate || lastCacheUpdate.getTime() + 60000 < Date.now()) {
		lastCacheUpdate = new Date();
		cache.clear();
		const parser = new RssParser();
		await Promise.all([
			await Promise.all([
				parser.parseUrl('https://www.theguardian.com/us-news/rss'),
				parser.parseUrl('https://51st.news/rss/'),
				parser.parseUrl('https://www.arlnow.com/feed/'),
				parser.parseUrl('https://www.ffxnow.com/feed/')
			]).then(([guardian, fiftyFirst, arlNow, ffxNow]) => {
				cache.set(CacheSource.NEWS, guardian);
				const localGuardian = {
					...guardian,
					items: guardian.items.filter((item) => item.categories.includes('Washington DC'))
				};
				cache.set(CacheSource.LOCAL, StoryUtil.sortMultipleSources(24, localGuardian, fiftyFirst, arlNow, ffxNow));
			}),
			await Promise.all([parser.parseUrl('https://www.theguardian.com/us/commentisfree/rss'), parser.parseUrl('https://jacobin.com/feed/')]).then(
				([guardian, jacobin]) => {
					cache.set(CacheSource.OPINION, StoryUtil.sortMultipleSources(6, guardian, jacobin));
				}
			),
			await Promise.all([
				parser.parseUrl('https://theintercept.com/feed/'),
				parser.parseUrl('https://www.propublica.org/feeds/propublica/main')
			]).then(([intercept, propublica]) => {
				cache.set(CacheSource.INVESTIGATIVE, StoryUtil.sortMultipleSources(0, intercept, propublica));
			}),
			parser.parseUrl('https://www.theguardian.com/us/lifeandstyle/rss').then((rss) => {
				cache.set(CacheSource.STYLE, rss);
			}),
			await Promise.all([parser.parseUrl('https://variety.com/feed/'), parser.parseUrl('https://www.theguardian.com/us/culture/rss')]).then(
				([variety, guardian]) => {
					cache.set(CacheSource.POP_CULTURE, StoryUtil.sortMultipleSources(6, variety, guardian));
				}
			),
			parser.parseUrl('https://www.cbssports.com/rss/headlines/').then((rss) => {
				cache.set(CacheSource.SPORTS, rss);
			})
		]);
	}
	const newsFeed = cache.get(CacheSource.NEWS);
	const localFeed = cache.get(CacheSource.LOCAL);
	const guardianOpinionFeed = cache.get(CacheSource.OPINION);
	const investigative = cache.get(CacheSource.INVESTIGATIVE);
	const cultureFeed = cache.get(CacheSource.POP_CULTURE);
	const styleFeed = cache.get(CacheSource.STYLE);
	const sportsFeed = cache.get(CacheSource.SPORTS);
	return {
		newsItems: newsFeed?.items ?? [],
		localItems: localFeed?.items ?? [],
		opinionItems: guardianOpinionFeed?.items ?? [],
		investigativeItems: investigative?.items ?? [],
		popCultureItems: cultureFeed?.items ?? [],
		styleItems: styleFeed?.items ?? [],
		sportsItems: sportsFeed?.items ?? []
	};
}) satisfies LayoutServerLoad;

enum CacheSource {
	NEWS = 'news',
	LOCAL = 'local',
	OPINION = 'opinion',
	INVESTIGATIVE = 'investigative',
	POP_CULTURE = 'popCulture',
	STYLE = 'style',
	SPORTS = 'sports'
}
