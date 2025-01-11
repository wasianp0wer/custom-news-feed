<script lang="ts">
	import type { RssItem } from '../util/rss-parser';
	import { StoryUtil } from '../util/story-util';
	import ByLine from './ByLine.svelte';

	interface Props {
		item: RssItem;
		nextThree: RssItem[];
	}

	let { item, nextThree }: Props = $props();
</script>

<div class="first story">
	<h1><a href="/story/{item.item_id}">{item.title}</a></h1>
	<ByLine creator={item.dc_creator} />

	<div class="content">
		<img src={item.media_content[0].url} alt="sorry" style="width: {item.media_content[0].width}px" />
		<!-- <img src={item.media_content[0].url} alt="sorry" style="width: 50%;" /> -->
		<div class="description">
			<div>
				{@html item.description}
				<a class="continue" href="/story/{item.item_id}">Continue reading...</a>
			</div>
			{#each nextThree as next}
				<hr />
				<h3 class="substory"><a href="/story/{next.item_id}">{next.title}</a></h3>
			{/each}
		</div>
	</div>
	<small>Source: {item.source}</small>
</div>

<style>
	.first {
		grid-column: span 3;
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
		transition: transform 0.3s ease-in-out;
		height: 100%;
	}

	.story:hover {
		transform: scale(var(--top-story-grow-factor));
	}

	.story h2 a {
		text-decoration: none;
		color: #333;
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
