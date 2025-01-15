<script lang="ts">
	import type { RssItem } from '../util/rss-parser';
	import { TimeUnit } from '../util/story-util';
	import ByLine from './ByLine.svelte';
	import Story from './Story.svelte';

	interface Props {
		items: RssItem[];
		align: 'left' | 'right' | 'center';
		title: string;
		gridRow: number;
		gridSpan?: number;
	}

	let { items, align, title, gridRow, gridSpan = 1 }: Props = $props();

	let gridColumn = $derived.by(() => {
		switch (align) {
			case 'left':
				return '-2 / 0';
			case 'right':
				return '-2 / -1';
			case 'center':
				return '-1 / 0';
			// FIXME: I'm like 90% sure this doesn't work.
		}
	});
</script>

<div class="column" style="grid-column: {gridColumn}; grid-row: {gridRow + 1}">
	<h2>{title}</h2>
	<div class="columnitems">
		{#each items as item}
			<div class="item">
				<hr class="divider" />
				<h3><a href={item.link} target="_blank">{item.title}</a></h3>
				<ByLine creator={item.dc_creator} publishedAt={item.pubDate} showBreakingTime={true} breakingMinutes={60} />
			</div>
		{/each}
	</div>
	<div class="readmore"><a href="/opinion">Read more ➤</a></div>
</div>

<style>
	.column {
		/* grid-column: -2 / -1; */
		/* grid-row: span 1; */
		padding: 20px;
		border: 2px solid var(--color-theme-1);
		border-radius: 8px;
		background-color: var(--color-theme-3);
		transition:
			transform 0.3s ease-in-out,
			border 0.3s ease-in-out;
		height: 100%;
	}

	.columnitems {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.item {
	}

	.readmore {
		margin-top: 0.5rem;
	}

	.divider {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		border-color: var(--color-theme-1);
	}
</style>
