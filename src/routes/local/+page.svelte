<script lang="ts">
	import Story from '../../components/Story.svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let localItems = $derived.by(() => data.localItems);
</script>

<h1>Local</h1>

<div class="stories">
	{#each localItems as item}
		<Story {item} highlightTimeIfBreaking={true} />
	{/each}
</div>
