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

	let topStorySize = $derived.by(() => {
		if (topThreeItemsAssociatedWithTopStory.length === 3) {
			return 3;
		} else if (topThreeItemsAssociatedWithTopStory.length === 0) {
			return 1;
		} else {
			return 2;
		}
	});

	let expandOpinion = $state(false);

	let displayItems = $derived.by(() =>
		data.newsItems
			.slice(1)
			.filter((item) => !item.categories.includes(topCategory))
			.slice(0, layoutConfig.newStoryRows * 3 - 2 - (expandOpinion ? 1 : 0) + (3 - topStorySize))
	);

	let latestItems = $derived.by(() =>
		data.newsItems
			.slice(1)
			.filter((item) => !displayItems.includes(item))
			.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
			.slice(0, layoutConfig.latestCount)
	);

	let opinionCount = $derived.by(() => (expandOpinion ? layoutConfig.expandedOpinionCount : layoutConfig.opinionCount));

	let opinionItems = $derived.by(() => data.opinionItems.slice(0, opinionCount));
	let localItems = $derived.by(() => data.localItems.slice(0, layoutConfig.localStoryRows * 3));
	let investigationItems = $derived.by(() => data.investigativeItems.slice(0, layoutConfig.investigationRows * 3));
	let styleItems = $derived.by(() => data.styleItems.slice(0, layoutConfig.styleRows * 3));

	let cultureItems = $derived.by(() => data.popCultureItems.slice(0, layoutConfig.cultureRows * 3));

	function onOpinionExpand(expanded: boolean) {
		expandOpinion = expanded;
	}
</script>

<div>
	<div class="stories">
		<TopStory item={topStory} nextThree={topThreeItemsAssociatedWithTopStory} {topStorySize} />
		<StoryColumn items={opinionItems} align="right" title="Opinions" gridRow={1} link="/opinions" onExpand={onOpinionExpand} />
		<StoryColumn items={latestItems} align="left" title="Latest" gridRow={2} includeExpand={false} />
		{#each displayItems as item, index}
			<Story {item} highlightTimeIfBreaking={index < 4} />
		{/each}
	</div>
	<h1 class="section-divider">Top Investigations</h1>
	<div class="stories">
		{#each investigationItems as item, index}
			<Story {item} highlightTimeIfBreaking={true} />
		{/each}
	</div>
	<h1 class="section-divider">Local</h1>
	<div class="stories">
		{#each localItems as item, index}
			<Story {item} highlightTimeIfBreaking={index < 3} />
		{/each}
	</div>
	<h1 class="section-divider">Style</h1>
	<div class="stories">
		{#each styleItems as item, index}
			<Story {item} />
		{/each}
	</div>
	<h1 class="section-divider">Culture</h1>
	<div class="stories">
		{#each cultureItems as item, index}
			<Story {item} highlightTimeIfBreaking={index < 3} />
		{/each}
	</div>
</div>

<svelte:head>
	<title>Home - 2602 News</title>
	<meta name="description" content="News for the 703, 571, and 202." />
</svelte:head>

<style>
	.section-divider {
		margin-top: 0.5em;
	}
	.stories {
		display: grid;
		gap: 20px;
		grid-template-columns: repeat(3, minmax(300px, 1fr)); /* Flexible column sizes */
		grid-auto-rows: minmax(150px, auto); /* Ensure rows have a consistent minimum height */
		grid-auto-flow: dense; /* Allows grid items to fill empty spaces */
	}
</style>
