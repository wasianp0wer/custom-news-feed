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
		console.log(this.xmlParser.parse(rawXml));
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
		console.log(Object.keys(xml));
		switch (xml.title) {
			case 'The Guardian':
				this.transformGuardianXml(xml);
				break;
			case 'The 51st':
				this.transformFiftyFirstXml(xml);
				break;
		}
		this.transformFiftyFirstXml(xml);
	}

	validate(xml: RssPage) {
		for (let item of xml.items) {
			item.description = item.description.trim();
			if (!item.description.endsWith('.')) {
				item.description += '.';
			}
		}
	}

	transformFiftyFirstXml(xml: RssPage) {
		for (let item of xml.items) {
			item.source = RssSource.FIFTYFIRST;
		}
	}

	transformGuardianXml(xml: RssPage) {
		xml.items.forEach((item: RssItem) => {
			item.description = item.description.split('<p>')[1].split('</p>')[0];
			const newMediaContent: MediaContent[] = [];
			for (const media of item.media_content) {
				const existing = newMediaContent.find((m) => m.url.split('?')[0] === media.url.split('?')[0]);
				if (existing) {
					console.log(existing.width, media.width);
					if (existing.width >= media.width) {
						continue;
					} else {
						newMediaContent.splice(newMediaContent.indexOf(existing), 1);
					}
				}
				media.width = parseInt(media.width as any);
				newMediaContent.push(media);
			}
			console.log(newMediaContent);
			item.media_content = newMediaContent;
			item.source = RssSource.GUARDIAN;
			item.categories = item.categories.map((c) => (c as any)['#text']);
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
	FIFTYFIRST = 'The 51st'
}
