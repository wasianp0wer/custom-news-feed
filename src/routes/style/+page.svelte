<script lang="ts">
	import Story from '../../components/Story.svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let styleItems = $derived.by(() => data.styleItems);
</script>

<h1>Style</h1>

<div class="stories">
	{#each styleItems as item}
		<Story {item} highlightTimeIfBreaking={true} />
	{/each}
</div>
