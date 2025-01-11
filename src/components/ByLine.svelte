<script lang="ts">
	import { StoryUtil } from '../util/story-util';

	interface Props {
		creator: string;
	}

	let { creator }: Props = $props();
</script>

<h3>{StoryUtil.byLinePrefix(creator)} {creator}</h3>
