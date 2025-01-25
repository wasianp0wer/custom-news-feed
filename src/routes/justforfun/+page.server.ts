import type { PageServerLoad, Actions } from './$types';
import { RssParser, type RssItem, type RssPage } from '../../util/rss-parser';
import DateUtil from '../../util/date.util';

const comicsCache = new Map<Comic, RssItem>();
let onionCache: RssPage | undefined = undefined;
let lastComicsCacheUpdate: Date | undefined = undefined;
let lastOnionCacheUpdate: Date | undefined = undefined;

enum Comic {
	PEARLS_BEFORE_SWINE = 'Pearls Before Swine',
	CALVIN_AND_HOBBES = 'Calvin and Hobbes',
	GARFIELD = 'Garfield',
	FOXTROT = 'Foxtrot',
	THE_ONION = 'The Onion'
}

export const load = (async ({ cookies }) => {
	if (!lastComicsCacheUpdate || lastComicsCacheUpdate.getDate() !== DateUtil.getTimezoneDate('EST').getDate()) {
		lastComicsCacheUpdate = DateUtil.getTimezoneDate('EST');
		const parser = new RssParser();
		await Promise.all([
			parser.parseUrl('https://www.comicsrss.com/rss/pearlsbeforeswine.rss'),
			parser.parseUrl('https://www.comicsrss.com/rss/calvinandhobbes.rss'),
			parser.parseUrl('https://www.comicsrss.com/rss/garfield.rss'),
			parser.parseUrl('https://www.comicsrss.com/rss/foxtrotclassics.rss')
		]).then(([pearls, calvin, garfield, foxtrot]) => {
			comicsCache.set(Comic.PEARLS_BEFORE_SWINE, pearls.items[0]);
			comicsCache.set(Comic.CALVIN_AND_HOBBES, calvin.items[0]);
			comicsCache.set(Comic.GARFIELD, garfield.items[0]);
			comicsCache.set(Comic.FOXTROT, foxtrot.items[0]);
		});
	}

	if (!lastOnionCacheUpdate || lastOnionCacheUpdate.getTime() + 60000 < DateUtil.getTimezoneDate('EST').getTime()) {
		lastOnionCacheUpdate = DateUtil.getTimezoneDate('EST');
		const parser = new RssParser();
		await parser.parseUrl('https://theonion.com/feed/').then((onion) => {
			onionCache = onion;
		});
	}

	return {
		pearls: comicsCache.get(Comic.PEARLS_BEFORE_SWINE),
		calvin: comicsCache.get(Comic.CALVIN_AND_HOBBES),
		garfield: comicsCache.get(Comic.GARFIELD),
		foxtrot: comicsCache.get(Comic.FOXTROT),
		onion: onionCache!.items.slice(0, 6)
	};
}) satisfies PageServerLoad;
