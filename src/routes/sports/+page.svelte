<script lang="ts">
	import Story from '../../components/Story.svelte';
	import StoryColumn from '../../components/StoryColumn.svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let sportsItems = $derived.by(() => data.sportsItems.filter((item) => !item.description.toLowerCase().includes('how to watch')));
	let howToWatchItems = $derived.by(() => data.sportsItems.filter((item) => item.description.toLowerCase().includes('how to watch')));
</script>

<h1>Sports</h1>

<div class="stories">
	<StoryColumn items={howToWatchItems.slice(0, 4)} gridRow={0} align="left" title="How to watch:" includeExpand={false} />
	{#each sportsItems as item}
		<Story {item} highlightTimeIfBreaking={true} />
	{/each}
</div>
