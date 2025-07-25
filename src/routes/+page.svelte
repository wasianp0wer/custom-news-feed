<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Story from '../components/Story.svelte';
	import StoryColumn from '../components/StoryColumn.svelte';
	import TopStory from '../components/TopStory.svelte';
	import { layoutConfig } from '../config/layout-config';
	import type { LayoutConfig } from '../util/config';
	import type { ActionData, PageData } from './$types';
	import Header from './Header.svelte';
	import { get } from 'svelte/store';
	import type { RssItem, RssPage } from '../util/rss-parser';
	import { StoryUtil } from '../util/story.util';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { BasicCategories } from '../common/basic-cats';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let topStory = $derived.by(() => data.newsItems[0] ?? ({} as RssItem));

	let isOnMobile = $state(false);

	let bannerText: string | undefined = $derived.by(() => {
		if (!data.breakingNewsItem) {
			return undefined;
		}
		return `BREAKING: <a style="color: white; font-weight: normal;" href="${data.breakingNewsItem.link}">${data.breakingNewsItem.title}</a>`;
	});

	let interval: number;

	onMount(() => {
		isOnMobile = window.innerWidth < 768;
		window.addEventListener('resize', () => {
			isOnMobile = window.innerWidth < 768;
		});
		interval = setInterval(
			() => {
				if (!document.hidden) {
					invalidateAll();
				}
			},
			1000 * 60 * 5
		);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	let topCategory: string = $derived.by(() => {
		if (!topStory) {
			return '';
		}
		return topStory.categories[0];
	});

	let topThreeItemsAssociatedWithTopStory = $derived.by(() => {
		return data.newsItems.slice(0, 20).filter((item) => item.categories.includes(topCategory)).slice(1, 4);
	});

	let topStorySize = $derived.by(() => {
		var score = 0;
		if (topThreeItemsAssociatedWithTopStory.length === 3) {
			score = 3;
		} else if (topThreeItemsAssociatedWithTopStory.length === 0) {
			score = 1;
		} else {
			score = 2;
		}
		if (BasicCategories.includes(topCategory)) {
			score = Math.max(score, 2);
		}
		return score;
	});

	let expandOpinion = $state(false);

	let investigationItems = $derived.by(() => data.investigativeItems.slice(0, layoutConfig.investigationRows * 3));

	let displayItems = $derived.by(() =>
		StoryUtil.sortMultipleSources(
			12,
			{ items: data.newsItems.slice(1).filter((item) => !item.categories.includes(topCategory)) } as RssPage,
			{ items: investigationItems } as RssPage
		).items.slice(0, layoutConfig.newStoryRows * 3 - 2 - (expandOpinion ? 1 : 0) + (3 - topStorySize))
	);

	let latestItems = $derived.by(() =>
		[
			...data.newsItems,
			...data.investigativeItems,
			...data.opinionItems,
			...data.localItems,
			...data.styleItems,
			...data.sportsItems,
			...data.popCultureItems
		]
			.slice(1)
			.filter((item) => !displayItems.includes(item))
			.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
			.slice(0, layoutConfig.latestCount)
	);

	let opinionCount = $derived.by(() => (expandOpinion ? layoutConfig.expandedOpinionCount : layoutConfig.opinionCount));

	let opinionItems = $derived.by(() => data.opinionItems.slice(0, opinionCount));
	let localItems = $derived.by(() => data.localItems.slice(0, layoutConfig.localStoryRows * 3));
	let styleItems = $derived.by(() => data.styleItems.slice(0, layoutConfig.styleRows * 3));
	let sportsItems = $derived.by(() => data.sportsItems.slice(0, layoutConfig.sportsRows * 3));
	let cultureItems = $derived.by(() => data.popCultureItems.slice(0, layoutConfig.cultureRows * 3));

	function onOpinionExpand(expanded: boolean) {
		expandOpinion = expanded;
	}
</script>

<div>
	{#if !isOnMobile}
		{#if bannerText}
			<div class="banner">{@html bannerText}</div>
		{/if}
		<div class="non-mobile-body" style="margin-top: {bannerText ? '42' : '0'}px;">
			<div class="stories">
				<TopStory item={topStory} nextThree={topThreeItemsAssociatedWithTopStory} {topStorySize} />
				<StoryColumn items={opinionItems} align="right" title="Opinions" gridRow={1} link="/opinions" onExpand={onOpinionExpand} />
				<StoryColumn items={latestItems} align="left" title="Latest" gridRow={2} includeExpand={false} />
				{#each displayItems as item, index}
					<Story {item} highlightTimeIfBreaking={index < 4} />
				{/each}
			</div>
			<!-- <h1 class="section-divider"><a href="/investigations">Top Investigations</a> ➤</h1>
		<div class="stories">
			{#each investigationItems as item, index}
				<Story {item} highlightTimeIfBreaking={true} />
			{/each}
		</div> -->
			<h1 class="section-divider"><a href="/local">Local</a> ➤</h1>
			<div class="stories">
				{#each localItems as item, index}
					<Story {item} highlightTimeIfBreaking={index < 3} />
				{/each}
			</div>
			<h1 class="section-divider"><a href="/style">Style</a> ➤</h1>
			<div class="stories">
				{#each styleItems as item, index}
					<Story {item} />
				{/each}
			</div>
			<h1 class="section-divider"><a href="/sports">Sports</a> ➤</h1>
			<div class="stories">
				<!-- TODO: This can easily get clogged up by a big sports event, but it doesn't have categories. Chat GPT? -->
				{#each sportsItems as item, index}
					<Story {item} highlightTimeIfBreaking={index < 3} />
				{/each}
			</div>
			<h1 class="section-divider"><a href="/entertainment">Culture</a> ➤</h1>
			<div class="stories">
				{#each cultureItems as item, index}
					<Story {item} highlightTimeIfBreaking={index < 3} />
				{/each}
			</div>
		</div>
	{:else}
		<div class="stories-mobile">
			<TopStory item={topStory} nextThree={topThreeItemsAssociatedWithTopStory} topStorySize={1} />
			{#each displayItems.slice(0, 3) as item, index}
				<Story {item} isLastMobile={index === 2} highlightTimeIfBreaking={index < 4} />
			{/each}
		</div>
		<!-- <h1 class="section-divider"><a href="/investigations">Top Investigations</a> ➤</h1>
		<div class="stories-mobile">
			<TopStory item={investigationItems[0]} nextThree={[]} topStorySize={1} />
			{#each investigationItems.slice(1, 3) as item, index}
				<Story {item} isLastMobile={index === 1} highlightTimeIfBreaking={true} />
			{/each}
		</div> -->
		<h1 class="section-divider"><a href="/local">Local</a> ➤</h1>
		<div class="stories-mobile">
			<TopStory item={localItems[0]} nextThree={[]} topStorySize={1} />
			{#each localItems.slice(1, 4) as item, index}
				<Story {item} isLastMobile={index === 2} highlightTimeIfBreaking={true} />
			{/each}
		</div>
		<h1 class="section-divider"><a href="/style">Style</a> ➤</h1>
		<div class="stories-mobile">
			<TopStory item={styleItems[0]} nextThree={[]} topStorySize={1} />
			{#each styleItems.slice(1, 3) as item, index}
				<Story {item} isLastMobile={index === 1} highlightTimeIfBreaking={true} />
			{/each}
		</div>
		<h1 class="section-divider"><a href="/sports">Sports</a> ➤</h1>
		<div class="stories-mobile">
			<TopStory item={sportsItems[0]} nextThree={[]} topStorySize={1} />
			{#each sportsItems.slice(1, 3) as item, index}
				<Story {item} isLastMobile={index === 1} highlightTimeIfBreaking={true} />
			{/each}
		</div>
		<h1 class="section-divider"><a href="/entertainment">Culture</a> ➤</h1>
		<div class="stories-mobile">
			<TopStory item={cultureItems[0]} nextThree={[]} topStorySize={1} />
			{#each cultureItems.slice(1, 3) as item, index}
				<Story {item} isLastMobile={index === 1} highlightTimeIfBreaking={true} />
			{/each}
		</div>
	{/if}
</div>

<svelte:head>
	<title>Home - 2602 News</title>
	<meta name="description" content="News for the 703, 571, and 202." />
</svelte:head>

<style>
	.banner {
		background-color: red;
		color: white;
		text-align: center;
		padding: 10px;
		position: absolute;
		top: 64px;
		left: 0;
		width: 100%;
		z-index: 0;
	}
	/* Adjust the top margin of the main content to avoid overlap with the banner */
	h1 a {
		color: var(--color-theme-1);
		font-weight: normal;
	}
</style>
