import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { WordleGame } from './wordle-game';

export const load = (({ cookies }) => {
	const game = new WordleGame(cookies.get('sverdle'));

	return {
		/**
		 * The player's guessed words so far
		 */
		guesses: game.guesses,

		/**
		 * An array of strings like '__x_c' corresponding to the guesses, where 'x' means
		 * an exact match, and 'c' means a close match (right letter, wrong place)
		 */
		answers: game.answers,

		/**
		 * The correct answer, revealed if the game is over
		 */
		answer: game.answers.length >= 6 ? game.answer : null,
		isCurrentGuessWinning: game.isCurrentGuessWinning
	};
}) satisfies PageServerLoad;

export const actions = {
	/**
	 * Modify game state in reaction to a keypress. If client-side JavaScript
	 * is available, this will happen in the browser instead of here
	 */
	update: async ({ request, cookies }) => {
		const game = new WordleGame(cookies.get('sverdle'));

		const data = await request.formData();
		const key = data.get('key');

		const i = game.answers.length;

		if (key === 'backspace') {
			game.guesses[i] = game.guesses[i].slice(0, -1);
		} else {
			game.guesses[i] += key;
		}

		const guess = data.getAll('guess') as string[];
		game.isCurrentGuessWinning = game.enter(guess);

		cookies.set('sverdle', game.toString(), { path: '/' });
	},

	/**
	 * Modify game state in reaction to a guessed word. This logic always runs on
	 * the server, so that people can't cheat by peeking at the JavaScript
	 */
	enter: async ({ request, cookies }) => {
		const game = new WordleGame(cookies.get('sverdle'));

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
