<script lang="ts">
	import { enhance } from '$app/forms';
	import { confetti } from '@neoconfetti/svelte';
	import type { ActionData, PageData } from './$types';
	import { reducedMotion } from './reduced-motion';
	import { fade } from 'svelte/transition';

	interface Props {
		data: PageData;
		form: ActionData;
	}
	let { data, form = $bindable() }: Props = $props();

	/** Whether or not the user has won */
	let won = $derived(data.answers.at(-1) === 'xxxxx');

	/** The index of the current guess */
	let i = $derived(won ? -1 : data.answers.length);

	/** The current guess */
	// svelte-ignore state_referenced_locally
	let currentGuess = $state(data.guesses[i] || '');

	$effect(() => {
		currentGuess = data.guesses[i] || '';
	});

	/** Whether the current guess can be submitted */
	let submittable = $derived(currentGuess.length === 5);

	const { classnames, description } = $derived.by(() => {
		/**
		 * A map of classnames for all letters that have been guessed,
		 * used for styling the keyboard
		 */
		let classnames: Record<string, 'exact' | 'close' | 'missing'> = {};
		/**
		 * A map of descriptions for all letters that have been guessed,
		 * used for adding text for assistive technology (e.g. screen readers)
		 */
		let description: Record<string, string> = {};
		data.answers.forEach((answer, i) => {
			const guess = data.guesses[i];
			for (let i = 0; i < 5; i += 1) {
				const letter = guess[i];
				if (answer[i] === 'x') {
					classnames[letter] = 'exact';
					description[letter] = 'correct';
				} else if (!classnames[letter]) {
					classnames[letter] = answer[i] === 'c' ? 'close' : 'missing';
					description[letter] = answer[i] === 'c' ? 'present' : 'absent';
				}
			}
		});
		return { classnames, description };
	});

	/**
	 * Modify the game state without making a trip to the server,
	 * if client-side JavaScript is enabled
	 */
	function update(event: MouseEvent) {
		event.preventDefault();
		const key = (event.target as HTMLButtonElement).getAttribute('data-key');

		if (key === 'backspace') {
			currentGuess = currentGuess.slice(0, -1);
			if (form?.badGuess) form.badGuess = false;
		} else if (currentGuess.length < 5) {
			currentGuess += key;
		}
	}

	/**
	 * Trigger form logic in response to a keydown event, so that
	 * desktop users can use the keyboard to play the game
	 */
	function keydown(event: KeyboardEvent) {
		if (event.metaKey) return;

		if (event.key === 'Enter' && !submittable) return;

		document.querySelector(`[data-key="${event.key}" i]`)?.dispatchEvent(new MouseEvent('click', { cancelable: true }));
	}

	let showHowToPlay = $state(false);

	let showCopiedText = $state(false);

	let scoreCopyable = $derived.by(() => {
		let score = '';
		for (let guess of data.guesses) {
			if (!guess) continue;
			for (let letter of guess) {
				if (classnames[letter] === 'exact') {
					score += '🟩';
				} else if (classnames[letter] === 'close') {
					score += '🟨';
				} else {
					score += '⬜';
				}
			}
			score += '\n';
		}
		if (won) {
			return `${score}I won Twerdle in ${data.answers.length} guesses! Can you beat me?`;
		} else {
			return `${score}I'm playing Twerdle on 2602news. Can you guess the word?`;
		}
	});

	function copyScore() {
		showCopiedText = true;
		setTimeout(() => {
			showCopiedText = false;
		}, 3000);
		navigator.clipboard.writeText(scoreCopyable);
	}
</script>

<svelte:window onkeydown={keydown} />

<svelte:head>
	<title>Twerdle</title>
	<meta name="description" content="A Wordle clone for 2602news" />
</svelte:head>

<h1>Twerdle</h1>

{#if showHowToPlay}
	<div class="overlay" id="overlay"></div>
	<dialog open class="how-to-play-dialog">
		<h2>How to Play</h2>
		<p>Guess the word in 6 tries. Each guess must be a valid 5-letter word. Hit the enter button to submit.</p>
		<p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
		<br />
		<ul>
			<li><span class="exact">🟩</span> The letter is in the correct spot.</li>
			<li><span class="close">🟨</span> The letter is in the word but in the wrong spot.</li>
			<li><span class="missing">⬜</span> The letter is not in the word.</li>
		</ul>
		<br />
		<button onclick={() => (showHowToPlay = false)}>Close</button>
	</dialog>
{/if}

<form
	method="post"
	action="?/enter"
	use:enhance={() => {
		// prevent default callback from resetting the form
		return ({ update }) => {
			update({ reset: false });
		};
	}}
>
	<button onclick={() => (showHowToPlay = true)}>How to play</button>

	<div class="grid" class:playing={!won} class:bad-guess={form?.badGuess}>
		{#each Array.from(Array(6).keys()) as row (row)}
			{@const current = row === i}
			<h2 class="visually-hidden">Row {row + 1}</h2>
			<div class="row" class:current>
				{#each Array.from(Array(5).keys()) as column (column)}
					{@const guess = current ? currentGuess : data.guesses[row]}
					{@const answer = data.answers[row]?.[column]}
					{@const value = guess?.[column] ?? ''}
					{@const selected = current && column === guess.length}
					{@const exact = answer === 'x'}
					{@const close = answer === 'c'}
					{@const missing = answer === '_'}
					<div class="letter" class:exact class:close class:missing class:selected>
						{value}
						<span class="visually-hidden">
							{#if exact}
								(correct)
							{:else if close}
								(present)
							{:else if missing}
								(absent)
							{:else}
								empty
							{/if}
						</span>
						<input name="guess" disabled={!current} type="hidden" {value} />
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="controls">
		{#if won || data.answers.length >= 6}
			{#if !won && data.answer}
				<p>the answer was "{data.answer}"</p>
			{/if}
			<button data-key="enter" class="restart selected" onclick={copyScore}>
				{won ? 'You won :)' : `Game over :(`}
				<br />
				Share score?
			</button>
		{:else}
			<div class="keyboard">
				<button data-key="enter" class:selected={submittable} disabled={!submittable}>enter</button>

				<button onclick={update} data-key="backspace" formaction="?/update" name="key" value="backspace"> back </button>

				{#each ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as row}
					<div class="row">
						{#each row as letter}
							<button
								onclick={update}
								data-key={letter}
								class={classnames[letter]}
								disabled={submittable}
								formaction="?/update"
								name="key"
								value={letter}
								aria-label="{letter} {description[letter] || ''}"
							>
								{letter}
							</button>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</form>
{#if showCopiedText}
	<p transition:fade class="copied" style="">Score copied to clipboard.</p>
{/if}

{#if won}
	<div
		style="position: absolute; left: 50%; top: 30%"
		use:confetti={{
			particleCount: $reducedMotion ? 0 : undefined,
			force: 0.7,
			stageWidth: window.innerWidth,
			stageHeight: window.innerHeight,
			colors: ['#ff3e00', '#40b3ff', '#676778']
		}}
	></div>
{/if}

<style>
	:root {
		--color-twerdle-exact: #36af2e;
		--color-twerdle-partial: #d0cb3e;
	}

	form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex: 1;
	}

	.copied {
		position: absolute;
		bottom: 10%;
		left: 50%;
		transform: translateX(-50%);
	}

	.how-to-play {
		color: var(--color-text);
	}

	.how-to-play::before {
		content: 'i';
		display: inline-block;
		font-size: 0.8em;
		font-weight: 900;
		width: 1em;
		height: 1em;
		padding: 0.2em;
		line-height: 1;
		border: 1.5px solid var(--color-text);
		border-radius: 50%;
		text-align: center;
		margin: 0 0.5em 0 0;
		position: relative;
		top: -0.05em;
	}

	.grid {
		--width: min(100vw, 40vh, 380px);
		max-width: var(--width);
		align-self: center;
		justify-self: center;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.grid .row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 0.2rem;
		margin: 0 0 0.2rem 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		.grid.bad-guess .row.current {
			animation: wiggle 0.5s;
		}
	}

	.grid.playing .row.current {
		filter: drop-shadow(3px 3px 10px var(--color-bg-0));
	}

	.letter {
		aspect-ratio: 1;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		box-sizing: border-box;
		text-transform: lowercase;
		border: none;
		font-size: calc(0.08 * var(--width));
		border-radius: 2px;
		background: white;
		margin: 0;
		color: rgba(0, 0, 0, 0.7);
	}

	.letter.missing {
		background: rgba(255, 255, 255, 0.5);
		color: rgba(0, 0, 0, 0.5);
	}

	.letter.exact {
		background-color: var(--color-twerdle-exact);
		color: white;
	}

	.letter.close {
		background-color: var(--color-twerdle-partial);
		/* border: 2px solid var(--color-twerdle-partial); */
	}

	.selected {
		outline: 2px solid var(--color-theme-1);
	}

	.controls {
		text-align: center;
		justify-content: center;
		height: min(18vh, 10rem);
	}

	.keyboard {
		--gap: 0.2rem;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		height: 100%;
	}

	.keyboard .row {
		display: flex;
		justify-content: center;
		gap: 0.2rem;
		flex: 1;
	}

	.keyboard button,
	.keyboard button:disabled {
		--size: min(8vw, 4vh, 40px);
		background-color: white;
		color: black;
		width: var(--size);
		border: none;
		border-radius: 2px;
		font-size: calc(var(--size) * 0.5);
		margin: 0;
	}

	.keyboard button.exact {
		background: var(--color-twerdle-exact);
		color: white;
	}

	.keyboard button.missing {
		opacity: 0.5;
	}

	.keyboard button.close {
		background-color: var(--color-twerdle-partial);
	}

	.keyboard button:focus {
		background: var(--color-theme-1);
		color: white;
		outline: none;
	}

	.keyboard button[data-key='enter'],
	.keyboard button[data-key='backspace'] {
		position: absolute;
		bottom: 0;
		width: calc(1.5 * var(--size));
		height: calc(1 / 3 * (100% - 2 * var(--gap)));
		text-transform: uppercase;
		font-size: calc(0.3 * var(--size));
		padding-top: calc(0.15 * var(--size));
	}

	.keyboard button[data-key='enter'] {
		right: calc(50% + 3.5 * var(--size) + 0.8rem);
	}

	.keyboard button[data-key='backspace'] {
		left: calc(50% + 3.5 * var(--size) + 0.8rem);
	}

	.keyboard button[data-key='enter']:disabled {
		opacity: 0.5;
	}

	.restart {
		width: 100%;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.5);
		color: var(--color-text);
		border-radius: 2px;
		border: none;
	}

	.restart:hover {
		background: var(--color-theme-1);
		color: white;
		outline: none;
	}

	@keyframes wiggle {
		0% {
			transform: translateX(0);
		}
		10% {
			transform: translateX(-2px);
		}
		30% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-6px);
		}
		70% {
			transform: translateX(+4px);
		}
		90% {
			transform: translateX(-2px);
		}
		100% {
			transform: translateX(0);
		}
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5); /* Grey with transparency */
		z-index: 1; /* Overlay behind modal but above other content */
	}

	.how-to-play-dialog {
		border-radius: 10px;
		padding: 1.5rem;
		background: white;
		color: var(--color-text);
		border: 2px solid var(--color-theme-1);
		max-width: 90%;
		margin: auto;
		z-index: 2;
	}
	.how-to-play-dialog h2 {
		margin-top: 0;
	}
	.how-to-play-dialog ul {
		list-style: none;
		padding: 0;
	}
	.how-to-play-dialog li {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.how-to-play-dialog li span {
		margin-right: 0.5rem;
	}
	.how-to-play-dialog button {
		background: var(--color-theme-1);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		cursor: pointer;
	}
	.how-to-play-dialog button:hover {
		background: var(--color-theme-2);
	}
</style>
