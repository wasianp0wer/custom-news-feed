<script lang="ts">
	import Story from '../components/Story.svelte';
import TopStory from '../components/TopStory.svelte';
import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();
</script>

<div class="stories">
  {#each data.items as item, index}
    {#if index === 0}
      <TopStory {item}/>
    {:else}
    <Story {item}/>
    {/if}
  {/each}
</div>

<style>
  .stories {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>