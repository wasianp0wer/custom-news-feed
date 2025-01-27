<script lang="ts">
	import type { RssItem } from '../util/rss-parser';
	import { StoryUtil } from '../util/story.util';
	import ByLine from './ByLine.svelte';
	import Dateline from './Dateline.svelte';
	import Story from './Story.svelte';

	interface Props {
		item: RssItem;
		nextThree: RssItem[];
		topStorySize: number;
	}

	let { item, nextThree, topStorySize }: Props = $props();

	let mainCategory = $derived.by(() => {
		if (!item) {
			return '';
		}
		return item.categories[0];
	});

	let thumbnail = $derived.by(() => {
		if (!item) {
			return undefined;
		}
		if (item.media_content.length > 0) {
			return item.media_content[0];
		}
		return undefined;
	});
</script>

{#if topStorySize === 1}
	<div class="story">
		<div class="headline"><h2><a href={item.link} target={item.link.startsWith('/') ? undefined : '_blank'}>{@html item.title}</a></h2></div>
		<!-- TODO: Need to be able to click anywhere in the headline to go to link -->
		<ByLine creator={item.dc_creator} publishedAt={item.pubDate} showBreakingTime={true} />
		{#if thumbnail}
			<img src={thumbnail.url} width={thumbnail.width} alt="sorry" />
		{/if}
		<div class="description">{@html item.description}</div>
		<small>Source: {item.source}</small>
	</div>
{:else}
	<div class="first story" style="grid-column: span {topStorySize};">
		<div class="redlabel"><a class="redlabel-text" href="/category/{mainCategory}">{mainCategory}</a></div>
		<h1><a href={item.link} target={item.link.startsWith('/') ? undefined : '_blank'}>{item.title}</a></h1>
		<ByLine creator={item.dc_creator} publishedAt={item.pubDate} showBreakingTime={true} />

		<div class="content">
			{#if thumbnail}
				<img src={thumbnail.url} alt="sorry" style="width: {thumbnail.width}px" />
			{/if}
			<div class="description">
				<div>
					{@html item.description}
				</div>
				{#each nextThree as next}
					<hr />
					<h3 class="substory"><a href={next.link} target={item.link.startsWith('/') ? undefined : '_blank'}>{next.title}</a></h3>
				{/each}
				<hr />
			</div>
		</div>
		<small>Source: {item.source}</small>
	</div>
{/if}

<style>
	.redlabel {
		color: #fff;
		background-color: var(--color-breaking);
		font-size: 0.9rem;
		font-weight: bold;
		text-transform: uppercase;
		padding: 3px 8px;
		border-radius: 4px;
		display: inline-block;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
		width: fit-content; /* Only take up as much space as the text requires */
	}

	.redlabel-text {
		color: var(--color-bg-1);
	}

	.first {
		/* grid-column: span 3; */
		background-color: #f9f9f9;
		border-color: #bbb;
	}

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
		transform: scale(var(--top-story-grow-factor));
		border: 2px solid var(--color-theme-1);
	}

	.story h2 a {
		text-decoration: none;
		/* color: #333; */
		font-size: 1.4rem;
		font-weight: bold;
	}

	.story h3 {
		color: #555;
		font-size: 1rem;
		margin: 5px 0;
	}

	.content {
		display: flex;
		align-items: flex-start;
		gap: 20px;
		margin-top: 10px;
	}

	.content img {
		border-radius: 4px;
		width: 50%;
	}

	.description {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: auto;
		height: 100%;
		font-size: 1rem;
		color: #333;
	}

	.story small {
		font-size: 0.8rem;
		color: #777;
		margin-top: 10px;
	}

	.substory:hover {
		text-decoration: underline;
	}
	/* Media Query for Mobile */
	@media (hover: none) and (pointer: coarse), (max-width: 768px) {
		.story {
			border-radius: 8px 8px 0px 0px;
		}
		a:hover {
			text-decoration: none; /* Example: Remove hover underline from links */
			color: inherit; /* Keep link color consistent */
		}
		.story:hover {
			transform: none; /* Remove the hover scaling effect */
			border: inherit; /* Remove the hover border */
		}
	}
</style>
