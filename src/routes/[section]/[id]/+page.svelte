<script lang="ts">
	import ByLine from '../../../components/ByLine.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

{#if !data.item}
	<h1>404: Not Found</h1>
	<p>Hmmmm, something went wrong. We can't seem to find that story.</p>
{:else}
	<div class="inset-story">
		<small>Sourced: {data.item.source}</small>
		<h1 class="story-title">{data.item.title}</h1>
		<h3 class="story-byline">By <span class="author">{data.item.dc_creator}</span></h3>
		<div class="story-content">{@html data.item.content}</div>
	</div>
{/if}

<style>
	.story-byline {
		text-align: center;
		font-size: 2rem;
	}

	.story-title {
		text-align: center;
		font-size: 3rem;
		font-weight: bolder;
	}

	.story-content {
		margin-top: 1em;
		padding: 0 1rem;
	}

	.inset-story {
		position: relative;
		width: 90%;
		align-self: center;
		min-width: 10em;
		background-color: #f5f5f5;
		padding: 3em;
		overflow: hidden;
		border: 5px solid var(--color-theme-1);
		/* border-right: 5px solid var(--color-theme-1); */
		/* border-radius: 50px 50px 10px 10px; */

		/* Fade on all edges */
		mask-image: linear-gradient(to bottom, transparent, black 0.1%, black 99.9%, transparent),
			linear-gradient(to right, transparent, black 1%, black 99%, transparent);
		-webkit-mask-image: linear-gradient(to bottom, transparent, black 0.1%, black 99.9%, transparent),
			linear-gradient(to right, transparent, black 1%, black 99%, transparent);
		mask-composite: intersect;
		-webkit-mask-composite: destination-in; /* For WebKit browsers */
	}

	.inset-story small {
		position: absolute;
		font-size: 0.8rem;
		color: #777;
		top: 10px;
		right: 10px;
	}

	.author {
	}
</style>
