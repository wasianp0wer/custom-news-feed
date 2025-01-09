<script lang="ts">
	import { enhance } from '$app/forms';
	import { confetti } from '@neoconfetti/svelte';
	import type { ActionData, PageData } from './$types';
	import { reducedMotion } from './reduced-motion';

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
<div>{@html data.story}</div>