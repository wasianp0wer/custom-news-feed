<script lang="ts">
	import type { RssItem } from '../util/rss-parser';
	import { TimeUnit } from '../util/story-util';
	import Story from './Story.svelte';

	interface Props {
		items: RssItem[];
	}

	let { items }: Props = $props();
</script>

<div class="column">
	<h2>Opinions</h2>
	<div class="columnitems">
		{#each items as item}
			<div class="item">
				<hr />
				<h3><a href="/story/{item.item_id}">{item.title}</a></h3>
			</div>
		{/each}
	</div>
</div>

<style>
	.column {
		grid-column: -2 / -1; /* Positions the column in the second-to-last column on the right */
		grid-row: span 2; /* Keeps the span of 2 rows as specified */
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #fff;
		transition:
			transform 0.3s ease-in-out,
			border 0.3s ease-in-out;
		height: 100%;
	}

	.columnitems {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.item {
		margin-top: 1em;
	}
</style>
