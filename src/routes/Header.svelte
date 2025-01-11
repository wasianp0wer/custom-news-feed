<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';

  let tabs = ['Home', 'Investigations', 'Local', 'Politics', 'World', 'Opinions', 'Style', 'Culture', 'Sports']

</script>

<header>
	<div class="corner">
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
      {#each tabs as tab}
        <li aria-current={$page.url.pathname === '/'+tab.toLowerCase() ? 'page' : undefined}>
          <a href={'/'+tab.toLowerCase()}>{tab}</a>
        </li>
      {/each}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
	</div>
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
	background-color: var(--color-bg-1);
	border-radius: 3px;
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
	padding: 0;
	margin: 0;
	height: 3em;
	display: flex;
	justify-content: center;
	align-items: center;
	list-style: none;
	background-color: var(--color-bg-0);
	background-size: contain;
	border-radius: 3px;
}

li {
	position: relative;
	height: 100%;
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
	border-top: var(--size) solid var(--color-theme-1);
}

nav a {
	display: flex;
	height: 100%;
	align-items: center;
	padding: 0 0.5rem;
	color: var(--color-text);
	font-weight: 700;
	font-size: 0.8rem;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	text-decoration: none;
	transition: color 0.2s linear;
}

nav a:hover {
	color: var(--color-theme-1);
}

</style>
