import * as cheerio from 'cheerio';

export class ItnParser {
	constructor() {}

	public fetchAndParseItn(): Promise<ItnItem[]> {
		const itnUrl = 'https://en.wikipedia.org/wiki/Template:In_the_news';
		return fetch(itnUrl)
			.then((response) => response.text())
			.then((html) => this.parseItnHtml(html));
	}

	public parseItnHtml(html: string): ItnItem[] {
		const doc = cheerio.load(html);
		const items: ItnItem[] = [];

		const newsItems = doc('.mw-content-ltr').find('ul').first().find('li');

		newsItems.each((_, element) => {
			const title = this.findBestTitle(doc(element), doc);
			if (!title) return; // Skip if no title found
			const description = doc(element)
				.text()
				.trim()
				.replaceAll(/\s*\(.*pictured.*\)/g, '');
			const link = doc(element).find('a').first().attr('href');
			const fullLink = link ? `https://en.wikipedia.org${link}` : undefined;
			const pubDate = new Date().toISOString();

			items.push({ title, description, link: fullLink, pubDate });
		});

		return items;
	}

	private findBestTitle(element: cheerio.Cheerio, doc: cheerio.Root): string {
		const titleOptions = element.find('b');
		if (!titleOptions) return '';

		let bestTitle: string;

		bestTitle = doc(
			titleOptions.toArray().find((el) => {
				const text = doc(el).text().trim();
				const firstLetter = text.charAt(0);
				return (
					(firstLetter && firstLetter === firstLetter.toUpperCase()) || text.toLowerCase().startsWith('the ') || text.toLowerCase().startsWith('a ')
				);
			})
		)
			.text()
			.trim();

		if (!bestTitle) {
			// First fallback: Use up to the first punctuation mark as the title.
			const fullText = doc(element).text().trim();
			const punctuationIndex = fullText.search(/[.,?!;:\(]/);
			bestTitle = punctuationIndex !== -1 ? fullText.substring(0, punctuationIndex).trim() : '';
			if (bestTitle.split(' ').length > 4) {
				bestTitle = '';
			}
		}

		if (!bestTitle) {
			// Second fallback: Look for viable phrases in the links.
			const links = element.find('a');
			const firstViableLink = links.toArray().find((el) => {
				const text = doc(el).text().trim();
				const firstLetter = text.charAt(0);
				return (
					(firstLetter && firstLetter === firstLetter.toUpperCase()) || text.toLowerCase().startsWith('the ') || text.toLowerCase().startsWith('a ')
				);
			});
			if (firstViableLink) {
				bestTitle = doc(firstViableLink).text().trim();
			}
		}

		if (bestTitle.toLowerCase().startsWith('the ')) {
			bestTitle = bestTitle.substring(4).trim();
		} else if (bestTitle.toLowerCase().startsWith('a ')) {
			bestTitle = bestTitle.substring(2).trim();
		}

		return this.capitalizeTitle(bestTitle);
	}

	private capitalizeTitle(title: string): string {
		return title
			.split(' ')
			.map((word) => {
				word = word.charAt(0).toUpperCase() + word.slice(1);
				return word;
			})
			.join(' ');
	}
}

export interface ItnItem {
	title: string;
	description: string;
	link: string | undefined;
	pubDate: string;
}
