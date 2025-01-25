<script lang="ts">
	import Story from '../../components/Story.svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let popCultureItems = $derived.by(() => data.popCultureItems);
</script>

<h1>Culture and Entertainment</h1>

<div class="stories">
	{#each popCultureItems as item}
		<Story {item} highlightTimeIfBreaking={true} />
	{/each}
</div>
