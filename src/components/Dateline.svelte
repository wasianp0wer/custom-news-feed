<script lang="ts">
	import { StoryUtil, TimeUnit, type TimeAgo } from '../util/story-util';

	interface Props {
		publishedAt: Date;
		breakingMinutes?: number;
	}

	let { publishedAt, breakingMinutes }: Props = $props();

	let showBreaking: boolean = $derived.by(() => !!breakingMinutes);

	let timeUnit: TimeAgo = $derived.by(() => StoryUtil.getTimeSincePublished(publishedAt));
</script>

<span class={timeUnit.unit === TimeUnit.MINUTE && showBreaking && timeUnit.value < (breakingMinutes ?? 0) ? 'breaking' : ''}
	>{timeUnit.value}
	{timeUnit.unit}{#if timeUnit.value > 1}s{/if} ago</span
>

<style>
	.breaking {
		color: var(--color-breaking);
	}
</style>
