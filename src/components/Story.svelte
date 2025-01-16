<script lang="ts">
	import type { RssItem } from '../util/rss-parser';
	import { StoryUtil } from '../util/story-util';
	import ByLine from './ByLine.svelte';
	import Dateline from './Dateline.svelte';

	interface Props {
		item: RssItem;
		highlightTimeIfBreaking?: boolean;
	}

	let { item, highlightTimeIfBreaking = false }: Props = $props();

	let thumbnail = $derived.by(() => {
		if (item.media_content.length > 0) {
			return item.media_content[0];
		}
		return undefined;
	});
</script>

<div class="story">
	<div class="headline"><h2><a href={item.link} target="_blank">{@html item.title}</a></h2></div>
	<!-- TODO: Need to be able to click anywhere in the headline to go to link -->
	<ByLine creator={item.dc_creator} publishedAt={item.pubDate} showBreakingTime={highlightTimeIfBreaking} />
	{#if thumbnail}
		<img src={thumbnail.url} width={thumbnail.width} alt="sorry" />
	{/if}
	<div class="description">{@html item.description}</div>
	<!-- <a class="continue" href="/story/{item.item_id}">Continue reading...</a> -->
	<small>Source: {item.source}</small>
</div>

<style>
	.story {
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

	.story:hover {
		transform: scale(var(--story-grow-factor));
		border: 2px solid var(--color-theme-1);
	}

	.headline {
		font-weight: bold;
		color: var(--color-theme-1); /* Set the initial color */
		cursor: pointer;
	}

	.headline:hover a {
		color: var(--color-theme-5); /* Change the color of the link on hover */
	}

	.story h2 a {
		text-decoration: none;
		font-size: 1.4rem;
		color: var(--color-theme-1); /* Set the initial color */
		transition: color 0.3s ease-in-out; /* Smooth transition for color change */
	}

	.story h3 {
		color: #555;
		font-size: 1rem;
		margin: 5px 0;
	}

	.story img {
		width: 100%;
		height: auto;
		border-radius: 4px;
		margin: 10px 0;
	}

	.story div {
		font-size: 1rem;
		color: #333;
		margin-top: 10px;
	}

	.continue {
		margin-top: 0px;
		padding: 4px 0px;
		align-self: flex-start; /* Ensures it aligns to the top */
	}

	.story small {
		margin-top: auto; /* Pushes the small text to the bottom */
		font-size: 0.8rem;
		color: #777;
	}

	.description {
		margin-bottom: 6px;
	}
</style>
