<script lang="ts">
	import Story from '../../components/Story.svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let investigativeItems = $derived.by(() => data.investigativeItems);
</script>

<h1>Investigations</h1>

<div class="stories">
	{#each investigativeItems as item}
		<Story {item} highlightTimeIfBreaking={true} />
	{/each}
</div>
