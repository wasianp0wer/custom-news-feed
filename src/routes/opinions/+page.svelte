<script lang="ts">
	import Story from '../../components/Story.svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let opinionItems = $derived.by(() => data.opinionItems);
</script>

<h1>Opinions</h1>

<div class="stories">
	{#each opinionItems as item}
		<Story {item} highlightTimeIfBreaking={true} />
	{/each}
</div>
