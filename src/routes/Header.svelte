<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';

	interface Tab {
		headerName: string;
		route: string;
	}

	let tabs: Tab[] = [
		{ headerName: 'Investigations', route: '/investigations' },
		{ headerName: 'Local', route: '/local' },
		// { headerName: 'Politics', route: '/us-politics' },
		// { headerName: 'World', route: '/world' },
		{ headerName: 'Opinions', route: '/opinions' },
		{ headerName: 'Style', route: '/style' },
		{ headerName: 'Culture', route: '/entertainment' },
		{ headerName: 'Sports', route: '/sports' },
		// { headerName: 'Moron Corner', route: '/morons' },
		{ headerName: 'Comics and Games', route: '/justforfun' }
	];
</script>

<header>
	<div class="corner"></div>

	<nav>
		<!-- <svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg> -->
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href={'/'}>Home</a>
			</li>
			{#each tabs as tab}
				<li aria-current={$page.url.pathname === tab.route ? 'page' : undefined}>
					<a href={tab.route}>{tab.headerName}</a>
				</li>
			{/each}
		</ul>
		<!-- <svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg> -->
	</nav>

	<div class="corner"></div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		background-color: var(--color-bg-0);
		border-bottom: 2px solid var(--color-theme-1);
		padding: 0.5rem 1rem;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		background-color: var(--color-text);
		border-radius: 10px;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--color-bg-1);
	}

	ul {
		position: relative;
		padding: 0px;
		padding-left: 20px;
		padding-right: 20px;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background-color: var(--color-text);
		background-size: contain;
		border-radius: 10px;
	}

	li {
		position: relative;
		height: 80%;
		margin-left: 0.25em;
		margin-right: 0.25em;
		margin-top: 10%;
		margin-bottom: 10%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-bg-0);
		margin-top: 0.1em;
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1rem;
		color: var(--color-bg-0);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition:
			background-color 0.2s linear,
			color 0.2s linear;
		border-radius: 3px;
	}

	nav a:hover {
		background-color: var(--color-theme-3);
		color: var(--color-text);
	}

	@media (max-width: 768px) {
		header {
			display: none;
		}
	}
</style>
