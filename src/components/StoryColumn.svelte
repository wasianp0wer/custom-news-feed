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
		includeExpand?: boolean;
		gridSpan?: number;
		link?: string;
		onExpand?: (expanded: boolean) => void;
	}

	let { items, align, title, gridRow, link, gridSpan = 1, includeExpand = true, onExpand }: Props = $props();

	let expanded = $state(false);

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

	function toggleExpand() {
		expanded = !expanded;
		if (onExpand) {
			onExpand(expanded);
		}
	}
</script>

<div class="column" style="grid-column: {gridColumn}; grid-row: {gridRow + 1} / {gridRow + 2 + (expanded ? 1 : 0)};">
	{#if link}
		<h2><a href={link}>{title}</a> ➤</h2>
	{:else}
		<h2>{title}</h2>
	{/if}
	<div class="columnitems">
		{#each items as item}
			<div class="item">
				<hr class="divider" />
				<div class="story">
					<h3><a href={item.link} target="_blank">{item.title}</a></h3>
					<ByLine creator={item.dc_creator} publishedAt={item.pubDate} showBreakingTime={true} breakingMinutes={60} />
				</div>
			</div>
		{/each}
	</div>
	{#if includeExpand}
		<button class="readmore" onclick={toggleExpand}>{expanded ? 'Condense' : 'Expand'}</button>
	{/if}
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
	h2 a {
		color: inherit;
		font-weight: inherit;
	}

	.columnitems {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.story {
		/* border-radius: 10px; */
		/* padding: 0.5em 0.25em; */
		padding-right: 0.75rem;
		/* width: calc(100% - 0.75rem); */
		border-left: 2px solid transparent;
		transition:
			transform 0.3s ease-in-out,
			border 0.3s ease-in-out,
			padding 0.3s;
	}

	.story:hover {
		/* transform: scale(var(--story-grow-factor)); */
		border-left: 2px solid var(--color-theme-1);
		padding-left: 0.75rem;
		padding-right: 0;
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
