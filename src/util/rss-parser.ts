import { XMLParser } from 'fast-xml-parser';

export class RssParser {
	xmlOptions = {
		ignoreAttributes: false,
		attributeNamePrefix: '',
		transformTagName: (tagName: string) => {
			if (['item'].includes(tagName)) {
				return 'items';
			}
			return tagName.replace(/:/g, '_');
		}
	};
	xmlParser: XMLParser;

	constructor() {
		this.xmlParser = new XMLParser(this.xmlOptions);
	}

	parse(rawXml: string) {
		console.log(this.xmlParser.parse(rawXml));
		const xml = this.xmlParser.parse(rawXml).rss.channel as RssPage;
		this.transformGuardianXml(xml);
		return xml;
	}

	async parseUrl(url: string) {
		const rawXml = await (await fetch(url)).text();
		return this.parse(rawXml);
	}

	transformGuardianXml(xml: RssPage) {
		xml.items.forEach((item: RssItem) => {
			item.shortDescription = item.description.split('<p>')[1].split('</p>')[0];
			const newMediaContent: MediaContent[] = [];
			for (const media of item.media_content) {
				const existing = newMediaContent.find((m) => m.url.split('?')[0] === media.url.split('?')[0]);
				console.log('existing', existing);
				if (existing) {
					if (existing.width >= media.width) {
						console.log('skipping');
						continue;
					} else {
						console.log('replacing');
						newMediaContent.splice(newMediaContent.indexOf(existing), 1);
					}
				}
				media.width = parseInt(media.width as any);
				newMediaContent.push(media);
			}
			item.media_content = newMediaContent;
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
	shortDescription: string;
	link: string;
	pubDate: Date;
	guid: string;
	dc_creator: string;
	media_content: MediaContent[];
	content: string;
	categories: string[];
}

export interface MediaContent {
	url: string;
	media_credit: string;
	width: number;
}

export enum RssSource {
	GUARDIAN
}
