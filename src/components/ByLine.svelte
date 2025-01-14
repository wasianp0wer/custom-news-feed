<script lang="ts">
	import { StoryUtil } from '../util/story-util';
	import Dateline from './Dateline.svelte';

	interface Props {
		creator: string;
		publishedAt?: Date;
		showBreakingTime?: boolean;
	}

	let { creator, publishedAt, showBreakingTime = false }: Props = $props();
</script>

<small>
	{StoryUtil.byLinePrefix(creator)}
	{creator}
	{#if publishedAt}
		• <Dateline {publishedAt} showBreaking={showBreakingTime} />
	{/if}
</small>
