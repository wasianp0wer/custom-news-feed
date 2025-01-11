<script lang="ts">
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

  $effect(() => {
    console.log(data.story);
  });
</script>
<h1>{data.title}</h1>
<h3>{data.author}</h3>
{#each data.media as media}
  <img src={media.url} width={media.width} alt="sorry"/>
{/each}
<div>{@html data.story}</div>