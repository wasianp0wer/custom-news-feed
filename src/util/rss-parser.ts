import { XMLParser } from 'fast-xml-parser';

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
		const xml = this.xmlParser.parse(rawXml).rss.channel;
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
		if (!Array.isArray(xml.items)) {
			xml.items = [xml.items];
		}
		for (const item of xml.items) {
			for (const field of this.itemArrayFields) {
				if (!Array.isArray((item as any)[field])) {
					(item as any)[field] = [(item as any)[field]];
				}
			}
		}
	}

	transformToConsistentFormat(xml: any) {
		switch (xml.title) {
			case 'The Guardian':
				this.transformGuardianXml(xml);
				break;
			case 'Opinion | The Guardian':
				this.transformGuardianOpinionXml(xml);
				break;
			case 'The 51st':
				this.transformFiftyFirstXml(xml);
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
		}
	}

	validate(xml: RssPage) {
		for (let item of xml.items) {
			item.description = item.description.trim();
			if (!item.description.endsWith('.')) {
				item.description += '.';
			}
			if (!((item.pubDate as any) instanceof Date)) {
				item.pubDate = new Date(item.pubDate);
			}
		}
	}

	transformFiftyFirstXml(xml: RssPage) {
		for (let item of xml.items) {
			item.source = RssSource.FIFTYFIRST;
		}
	}

	transformVariety(xml: RssPage) {
		for (let item of xml.items) {
			item.source = RssSource.PROPUBLICA;
			const match = item.description.match(/[a-z]\.( |$)/);
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
			item.source = RssSource.THEINTERCEPT;
		}
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
			item.description = item.description.split('<p>')[1].split('</p>')[0];
			const newMediaContent: MediaContent[] = [];
			for (const media of item.media_content) {
				const existing = newMediaContent.find((m) => m.url.split('?')[0] === media.url.split('?')[0]);
				if (existing) {
					if (existing.width >= media.width) {
						continue;
					} else {
						newMediaContent.splice(newMediaContent.indexOf(existing), 1);
					}
				}
				media.width = parseInt(media.width as any);
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
	item_id: string;
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
	VARIETY = 'Variety'
}
