<script lang="ts">
	import Story from '../components/Story.svelte';
	import StoryColumn from '../components/StoryColumn.svelte';
	import TopStory from '../components/TopStory.svelte';
	import { layoutConfig } from '../config/layout-config';
	import type { LayoutConfig } from '../util/config';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let topStory = $derived.by(() => data.newsItems[0]);

	let topCategory = $derived.by(() => topStory.categories[0]);

	let topThreeItemsAssociatedWithTopStory = $derived.by(() => {
		return data.newsItems.filter((item) => item.categories.includes(topCategory)).slice(1, 4);
	});

	let displayItems = $derived.by(() =>
		data.newsItems
			.slice(1)
			.filter((item) => !item.categories.includes(topCategory))
			.slice(0, layoutConfig.newStoryRows * 3 - 1)
	);

	let latestItems = $derived.by(() =>
		data.newsItems
			.slice(1)
			.filter((item) => !displayItems.includes(item))
			.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
			.slice(0, layoutConfig.latestCount)
	);

	let opinionItems = $derived.by(() => data.opinionItems.slice(0, layoutConfig.opinionCount));
	let localItems = $derived.by(() => data.localItems.slice(0, layoutConfig.localStoryRows * 3));
</script>

<div>
	<div class="stories">
		<TopStory item={topStory} nextThree={topThreeItemsAssociatedWithTopStory} />
		<StoryColumn items={opinionItems} />
		{#each displayItems as item, index}
			{#if index > 0}
				<Story {item} />
			{/if}
		{/each}
	</div>
	<h1 class="section-divider">Top Investigations</h1>
	<div class="stories">
		<Story item={topStory} />
		<Story item={topStory} />
		<Story item={topStory} />
	</div>
	<h1 class="section-divider">Latest</h1>
	<!-- Condensed section with just headlines that has any stories from primary news that are 
   not already displayed sorted by recency rather than relevence -->
	<div class="stories">
		{#each latestItems as item}
			<Story {item} />
			<!-- TODO: Replace with some kind of condensed box like opinions. Maybe this moves up and is on the left, kind of below and opposite opinions? -->
		{/each}
	</div>
	<h1 class="section-divider">Local</h1>
	<div class="stories">
		{#each localItems as item}
			<Story {item} />
		{/each}
	</div>
	<h1 class="section-divider">Style and culture</h1>
	<div class="stories">
		<Story item={topStory} />
		<Story item={topStory} />
		<Story item={topStory} />
		<Story item={topStory} />
		<Story item={topStory} />
		<Story item={topStory} />
	</div>
</div>

<style>
	.section-divider {
		margin-top: 0.5em;
	}
	.stories {
		display: grid;
		gap: 20px;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Flexible column sizes */
		grid-auto-rows: minmax(150px, auto); /* Ensure rows have a consistent minimum height */
		grid-auto-flow: dense; /* Allows grid items to fill empty spaces */
	}
</style>
