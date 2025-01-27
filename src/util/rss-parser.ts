import { XMLParser } from 'fast-xml-parser';
import { v4 as uuidv4 } from 'uuid';
import { StoryUtil } from './story.util';

export class RssParser {
	xmlOptions = {
		ignoreAttributes: false,
		attributeNamePrefix: '',
		transformTagName: (tagName: string) => {
			if (tagName === 'item') {
				return 'items';
			}
			if (tagName === 'category') {
				return 'categories';
			}
			return tagName.replace(/:/g, '_');
		}
	};
	xmlParser: XMLParser;
	itemArrayFields = ['media_content', 'categories'];

	constructor() {
		this.xmlParser = new XMLParser(this.xmlOptions);
	}

	parse(rawXml: string): RssPage {
		const baseXml = this.xmlParser.parse(rawXml);
		if (!baseXml.rss) {
			baseXml.rss = {
				channel: baseXml.feed
			};
		}
		const xml = baseXml.rss.channel;
		this.checkArrayFields(xml);
		this.transformToConsistentFormat(xml);
		this.validate(xml);
		return xml;
	}

	async parseUrl(url: string) {
		const rawXml = await (await fetch(url)).text();
		return this.parse(rawXml);
	}

	checkArrayFields(xml: RssPage) {
		if (!xml.items && (xml as any).entry) {
			xml.items = (xml as any).entry;
		} else if (!Array.isArray(xml.items)) {
			xml.items = [xml.items];
		}
		if ((xml.title as any) instanceof Object) {
			xml.title = (xml.title as any)['#text'];
		}
		for (const item of xml.items) {
			for (const field of this.itemArrayFields) {
				if (!Array.isArray((item as any)[field])) {
					(item as any)[field] = [(item as any)[field]];
				}
				item.id = StoryUtil.hashObject({ title: item.title });
			}
		}
	}

	transformToConsistentFormat(xml: any) {
		switch (xml.title) {
			case 'The Guardian':
			case 'Culture | The Guardian':
			case 'Lifestyle | The Guardian':
				this.transformGuardianXml(xml);
				break;
			case 'Opinion | The Guardian':
				this.transformGuardianOpinionXml(xml);
				break;
			case 'The 51st':
				this.transformFiftyFirstXml(xml);
				break;
			case 'ARLnow':
			case 'FFXnow':
				this.transformArlFfxNow(xml, xml.title);
				break;
			case 'ProPublica':
				this.transformPropublica(xml);
				break;
			case 'The Intercept':
				this.transformTheIntercept(xml);
				break;
			case 'Variety':
				this.transformVariety(xml);
				break;
			case 'Jacobin':
				this.transformJacobin(xml);
				break;
			case 'Pearls Before Swine':
			case 'Calvin and Hobbes':
			case 'Garfield':
			case 'FoxTrot Classics':
				this.transformComic(xml);
				break;
			case 'CBSSports.com Headlines':
				this.transformCBSSports(xml);
				break;
		}
	}

	validate(xml: RssPage) {
		for (let item of xml.items) {
			item.description = item.description.trim();
			if (
				!(
					item.description.endsWith('.') ||
					item.description.endsWith('!') ||
					item.description.endsWith('?') ||
					item.description.endsWith('”') ||
					item.description.endsWith('"')
				)
			) {
				item.description += '.';
			}
			if (!((item.pubDate as any) instanceof Date)) {
				item.pubDate = new Date(item.pubDate);
			}
		}
	}

	transformCBSSports(xml: RssPage) {
		for (let item of xml.items) {
			item.source = RssSource.CBS_SPORTS;
			item.media_content = [(item as any).enclosure];
		}
	}

	transformComic(xml: RssPage) {
		for (let item of xml.items) {
			item.source = RssSource.GO_COMICS;
			const match = item.description.match(/<img[^>]*>/);
			if (!match) {
				continue;
			}
			item.content = match[0];
		}
	}

	transformArlFfxNow(xml: RssPage, title: string) {
		xml.items = xml.items.filter(
			(item: RssItem) => !item.title.includes('Daily Debrief') && item.dc_creator !== 'Sponsor' && !item.categories.includes('Sponsored')
		);
		for (let item of xml.items) {
			if (title === 'ARLnow') {
				item.source = RssSource.ARL_NOW;
			}
			if (title === 'FFXnow') {
				item.source = RssSource.FFX_NOW;
			}
			item.categories.push('Local News');
			const regex = /\.[^\.(\/\>)]*\[&#8230;\]/;
			const newDescription = item.description.replace(regex, '.');
			if (newDescription.length !== 0) {
				item.description = item.description.replace(regex, '.').replace(/ *\[&#8230;\]/, '.');
			}
		}
	}

	transformFiftyFirstXml(xml: RssPage) {
		for (let item of xml.items) {
			item.source = RssSource.FIFTYFIRST;
			item.categories.push('Local News');
		}
	}

	transformVariety(xml: RssPage) {
		for (let item of xml.items) {
			item.source = RssSource.VARIETY;
			const match = item.description.match(/[a-z]\.( |\"|\”|$)/);
			if (match) {
				item.description = item.description.split(match[0])[0] + match[0];
			}
		}
	}

	transformPropublica(xml: RssPage) {
		for (let item of xml.items) {
			item.source = RssSource.PROPUBLICA;
		}
	}

	transformTheIntercept(xml: RssPage) {
		for (let item of xml.items) {
			if ((item.dc_creator as any) instanceof Array) {
				item.dc_creator = (item.dc_creator as any).join(', ');
			}
			item.description = item.description.split('<p>')[1].split('</p>')[0];
			// item.link = `/investigative/${item.id}`;
			// item.content = (item as any).content_encoded;
			item.source = RssSource.THEINTERCEPT;
		}
	}

	jacobinImageRegex = /(?:src)\s*=\s*["']([^"']+)["']/g;

	transformJacobin(xml: RssPage) {
		xml.items = (xml as any).entry;
		xml.items.forEach((item: RssItem) => {
			item.description = (item as any).summary['#text'];
			if ((item as any).author instanceof Array) {
				item.dc_creator = (item as any).author.map((a: any) => a.name).join(', ');
			} else {
				item.dc_creator = (item as any).author?.name ?? '';
			}
			item.content = ((item as any).content ?? {})['#text'] ?? '';
			const matches = item.content.matchAll(this.jacobinImageRegex);
			item.media_content = Array.from(matches, (match) => ({ url: match[1], media_credit: '', width: 0 }));
			item.pubDate = new Date((item as any).published);
			item.title = (item as any).title['#text'];
			item.source = RssSource.JACOBIN;
			item.categories.push('Opinion');
			item.link = item.content ? `/opinions/${item.id}` : (item.link as any).href;
			const match = item.description.match(/[a-z]\.( |\"|\”|$)/);
			if (match) {
				item.description = item.description.split(match[0])[0] + match[0];
			}
		});

		xml.items = xml.items.filter((item: RssItem) => item.content);
	}

	transformGuardianOpinionXml(xml: RssPage) {
		this.transformGuardianXml(xml);
		xml.items.forEach((item: RssItem) => {
			item.categories.push('Opinion');
			item.title = item.title.split(' | ')[0];
		});
	}

	transformGuardianXml(xml: RssPage) {
		xml.items.forEach((item: RssItem) => {
			item.description = item.description.split('<p>')[1]?.split('</p>')[0] ?? '';
			const newMediaContent: MediaContent[] = [];
			for (const media of item.media_content) {
				if (media === undefined) {
					continue;
				}
				const existing = newMediaContent.find((m) => m.url.split('?')[0] === media.url.split('?')[0]);
				if (existing) {
					if (existing.width >= media.width) {
						continue;
					} else {
						newMediaContent.splice(newMediaContent.indexOf(existing), 1);
					}
				}
				media.width = parseInt((media?.width as any) ?? '0');
				newMediaContent.push(media);
			}
			item.media_content = newMediaContent;
			item.source = RssSource.GUARDIAN;
			item.categories = item.categories
				? item.categories.map((c) => {
						if ((c as any) instanceof Object) {
							return (c as any)['#text'];
						}
					})
				: [];
		});
	}
}

export interface RssPage {
	title: string;
	description: string;
	link: string;
	items: RssItem[];
}

export interface RssItem {
	id: string;
	title: string;
	description: string;
	link: string;
	pubDate: Date;
	guid: string;
	dc_creator: string;
	media_content: MediaContent[];
	content: string;
	categories: string[];
	source: RssSource;
}

export interface MediaContent {
	url: string;
	media_credit: string;
	width: number;
}

export enum RssSource {
	GUARDIAN = 'The Guardian',
	FIFTYFIRST = 'The 51st',
	PROPUBLICA = 'ProPublica',
	THEINTERCEPT = 'The Intercept',
	VARIETY = 'Variety',
	ARL_NOW = 'ARLnow',
	FFX_NOW = 'FFXnow',
	JACOBIN = 'Jacobin',
	GO_COMICS = 'GoComics',
	CBS_SPORTS = 'CBS Sports'
}
