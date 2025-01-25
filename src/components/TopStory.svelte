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

	let mainCategory = $derived.by(() => item.categories[0]);

	let thumbnail = $derived.by(() => {
		if (item.media_content.length > 0) {
			return item.media_content[0];
		}
		return undefined;
	});
</script>

{#if topStorySize === 1}
	<Story {item} />
{:else}
	<div class="first story" style="grid-column: span {topStorySize};">
		<div class="redlabel"><a class="redlabel-text" href="/category/{mainCategory}">{mainCategory}</a></div>
		<h1><a href={item.link} target="_blank">{item.title}</a></h1>
		<ByLine creator={item.dc_creator} publishedAt={item.pubDate} showBreakingTime={true} />

		<div class="content">
			{#if thumbnail}
				<img src={thumbnail.url} alt="sorry" style="width: {thumbnail.width}px" />
				<!-- <img src={thumbnail.url} alt="sorry" style="width: 50%;" /> -->
			{/if}
			<div class="description">
				<div>
					{@html item.description}
					<!-- <a class="continue" href="/story/{item.item_id}">Continue reading...</a> -->
				</div>
				{#each nextThree as next}
					<hr />
					<h3 class="substory"><a href={next.link} target="_blank">{next.title}</a></h3>
				{/each}
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
</style>
