<script lang="ts">
	import { StoryUtil, TimeUnit, type TimeAgo } from '../util/story-util';

	interface Props {
		publishedAt: Date;
		showBreaking: boolean;
	}

	let { publishedAt, showBreaking }: Props = $props();

	let timeUnit: TimeAgo = $derived.by(() => StoryUtil.getTimeSincePublished(publishedAt));
</script>

<span class={timeUnit.unit === TimeUnit.MINUTE && timeUnit.value < 30 && showBreaking ? 'breaking' : ''}
	>{timeUnit.value}
	{timeUnit.unit}{#if timeUnit.value > 1}s{/if} ago</span
>

<style>
	.breaking {
		color: var(--color-breaking);
	}
</style>
