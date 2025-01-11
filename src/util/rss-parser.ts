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
		return this.xmlParser.parse(rawXml).rss.channel;
	}

	async parseUrl(url: string) {
		const rawXml = await (await fetch(url)).text();
		return this.parse(rawXml);
	}
}

export interface RssPage {
	title: string;
	description: string;
	link: string;
	items: RssItem[];
}

export interface RssItem {
	title: string;
	description: string;
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
