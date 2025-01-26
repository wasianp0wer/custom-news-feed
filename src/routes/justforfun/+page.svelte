<script lang="ts">
	import Story from '../../components/Story.svelte';
	import { type PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div>
	<h1>Games</h1>
	<div class="section">
		<div class="game">
			<h1><a href="/justforfun/twerdle">Twerdle</a></h1>
			<img src="/images/justforfun/twerdle-gameplay.png" alt="twerdle gameplay" />
			<br />
			<div>A word deducing game based off the smash hit Wordle.</div>
		</div>
		<div class="game">
			<h1><a href="/justforfun/sudoku">Sudoku</a></h1>
			<br />
			<div>Coming soon...</div>
		</div>
	</div>
	<h1 class="section-divider">Comics</h1>
	<div class="section">
		{#if data.pearls}
			<div class="comic">
				<h2>Pearls Before Swine</h2>
				<h3>By Stephan Pastis</h3>
				<div>{@html data.pearls.content}</div>
			</div>
		{/if}
		{#if data.calvin}
			<div class="comic">
				<h2>Calvin and Hobbes</h2>
				<h3>By Bill Waterston</h3>
				<div>{@html data.calvin.content}</div>
			</div>
		{/if}
		{#if data.foxtrot}
			<div class="comic">
				<h2>Foxtrot</h2>
				<h3>By Bill Amend</h3>
				<div>{@html data.foxtrot.content}</div>
			</div>
		{/if}
		{#if data.garfield}
			<div class="comic">
				<h2>Garfield</h2>
				<h3>By Jim Davis</h3>
				<div>{@html data.garfield.content}</div>
			</div>
		{/if}
	</div>
	<!-- <h1 class="section-divider">More fun</h1>
	<h2>From The Onion</h2>
	<div class="section">
		{#each data.onion as item}
			<Story {item} />
		{/each}
	</div> -->
</div>

<style>
	.section {
		display: grid;
		gap: 20px;
		grid-template-columns: repeat(2, 1fr); /* Flexible column sizes */
		grid-auto-rows: minmax(150px, auto); /* Ensure rows have a consistent minimum height */
		grid-auto-flow: dense; /* Allows grid items to fill empty spaces */
	}

	.game {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #fff;
		transition:
			transform 0.3s ease-in-out,
			border 0.3s ease-in-out;
		height: 100%;
	}

	.game:hover {
		transform: scale(var(--story-grow-factor));
		border: 2px solid var(--color-theme-1);
	}

	.comic {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #fff;
		height: 100%;
	}
</style>
