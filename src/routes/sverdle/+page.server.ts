import { fail } from '@sveltejs/kit';
import { Game } from './game';
import type { PageServerLoad, Actions } from './$types';
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

type GuardianFeed = {
  media: string;
};

export const load = (async ({ cookies }) => {
  const xmlOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '',
    transformTagName: (tagName: string) => tagName.replace(/:/g, '_')
  }
  const parser = new XMLParser(xmlOptions);
  const response = await fetch('https://www.theguardian.com/us/commentisfree/rss')
  const feed = parser.parse(response.text());
  console.log(feed);

	return {
    story: feed!.item[0].contentSnippet,
    title: feed!.item[0].title,
    author: feed!.item[0].creator,
	};
}) satisfies PageServerLoad;

export const actions = {
	/**
	 * Modify game state in reaction to a keypress. If client-side JavaScript
	 * is available, this will happen in the browser instead of here
	 */
	update: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));

		const data = await request.formData();
		const key = data.get('key');

		const i = game.answers.length;

		if (key === 'backspace') {
			game.guesses[i] = game.guesses[i].slice(0, -1);
		} else {
			game.guesses[i] += key;
		}

		cookies.set('sverdle', game.toString(), { path: '/' });
	},

	/**
	 * Modify game state in reaction to a guessed word. This logic always runs on
	 * the server, so that people can't cheat by peeking at the JavaScript
	 */
	enter: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));

		const data = await request.formData();
		const guess = data.getAll('guess') as string[];

		if (!game.enter(guess)) {
			return fail(400, { badGuess: true });
		}

		cookies.set('sverdle', game.toString(), { path: '/' });
	},

	restart: async ({ cookies }) => {
		cookies.delete('sverdle', { path: '/' });
	}
} satisfies Actions;
