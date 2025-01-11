<script lang="ts">
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();
</script>

<div>
  {#each data.items as item}
    <h2><a href="/story/{item.item_id}">{item.title}</a></h2>
    <h3>{item.dc_creator}</h3>
    {#each item.media_content as media}
      <img src={media.url} width={media.width} alt="sorry"/>
    {/each}
    <div>{@html item.shortDescription}</div>
  {/each}

</div>

<style>
  
</style>