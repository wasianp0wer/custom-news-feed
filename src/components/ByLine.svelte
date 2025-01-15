<script lang="ts">
	import { StoryUtil } from '../util/story-util';
	import Dateline from './Dateline.svelte';

	interface Props {
		creator: string;
		publishedAt?: Date;
		showBreakingTime?: boolean;
		breakingMinutes?: number;
	}

	let { creator, publishedAt, showBreakingTime = false, breakingMinutes }: Props = $props();
</script>

<small>
	{StoryUtil.byLinePrefix(creator)}
	{creator}
	{#if publishedAt}
		• <Dateline {publishedAt} breakingMinutes={showBreakingTime ? (breakingMinutes ?? 30) : undefined} />
	{/if}
</small>
