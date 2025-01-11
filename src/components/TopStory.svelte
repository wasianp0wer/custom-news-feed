<script lang="ts">
	import type { RssItem } from '../util/rss-parser';

	interface Props {
		item: RssItem;
	}

	let { item }: Props = $props();
</script>

<div class="first story">
	<h1><a href="/story/{item.item_id}">{item.title}</a></h1>
	<h3>{item.dc_creator}</h3>

	<img src={item.media_content[0].url} width={item.media_content[0].width} alt="sorry" />
	<div>{@html item.description}. <a href="/story/{item.item_id}">Continue reading...</a></div>
	<small>Source: {item.source}</small>
</div>

<style>
	.first {
		grid-column: span 3;
		background-color: #f9f9f9;
		border-color: #bbb;
	}

	.story {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #fff;
		transition: transform 0.3s ease-in-out;
		height: 100%;
	}

	.story:hover {
		transform: scale(1.05);
	}

	.story h2 a {
		text-decoration: none;
		color: #333;
		font-size: 1.4rem;
		font-weight: bold;
	}

	.story h3 {
		color: #555;
		font-size: 1rem;
		margin: 5px 0;
	}

	.story img {
		width: 100%;
		height: auto;
		border-radius: 4px;
		margin: 10px 0;
	}

	.story div {
		font-size: 1rem;
		color: #333;
		margin-top: 10px;
		flex-grow: 1;
	}

	.story small {
		font-size: 0.8rem;
		color: #777;
		margin-top: 10px;
	}
</style>
