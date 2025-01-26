<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import Loader from '../components/Loader.svelte';

	let { children } = $props();

	let enoughTimeElapsedSinceLoadStart = $state(false);

	let finishedLoading = $state(true);

	let showLoading = $derived.by(() => !finishedLoading && enoughTimeElapsedSinceLoadStart);

	onMount(() => {
		beforeNavigate(() => {
			finishedLoading = false;
			enoughTimeElapsedSinceLoadStart = false;
			setTimeout(() => {
				enoughTimeElapsedSinceLoadStart = true;
			}, 250);
		});

		afterNavigate(() => {
			finishedLoading = true;
		});
	});

	let isOnMobile = $state(false);

	onMount(() => {
		isOnMobile = window.innerWidth < 768;
		window.addEventListener('resize', () => {
			console.log(window.innerWidth);
			isOnMobile = window.innerWidth < 768;
		});
	});
</script>

<div class="app">
	{#if !isOnMobile}
		<Header />
	{/if}
	<main>
		{#if showLoading}
			<Loader />
		{:else}
			{@render children()}
		{/if}
	</main>

	<footer></footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 75rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
