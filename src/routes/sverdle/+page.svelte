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

<div>{@html data.story}</div>