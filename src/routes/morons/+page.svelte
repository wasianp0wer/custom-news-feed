<script lang="ts">
	import { onMount } from 'svelte';
	import Story from '../../components/Story.svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let confirmedWantToStay = $state(true);

	onMount(() => {
		confirmedWantToStay = localStorage.getItem('confirmedWantToStay') === 'true';
	});

	let doNotShowAgain = $state(false);

	function hideModal() {
		if (doNotShowAgain) {
			localStorage.setItem('confirmedWantToStay', 'true');
		}
		confirmedWantToStay = true;
	}
</script>

{#if confirmedWantToStay}
	<h1>"News"</h1>

	<div class="stories"></div>

	<h1>Fashy opinions</h1>
{:else}
	<dialog open class="warning">
		<h1>WARNING:</h1>
		<h3>You are about to see some really stupid, bad, and probably harmful or even hateful takes. Are you sure you want to proceed?</h3>
		<small
			>2602 News is not responsible for any spikes in blood pressure, aneurysms, or other side effects that may result from staying on this page.</small
		>
		<label class="checkbox-label">
			<input type="checkbox" bind:checked={doNotShowAgain} />
			Do not show me this warning again.
		</label>

		<div class="buttons">
			<button onclick={hideModal}>Yes</button>
			<div class="spacer"></div>
			<button onclick={() => window.history.back()}>No</button>
		</div>
	</dialog>
{/if}

<style>
	dialog.warning {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1rem;
		background-color: var(--color-bg-1);
		color: var(--color-text-1);
		border: 2px solid var(--color-theme-1);
		border-radius: 0.5rem;
		top: 30%;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.checkbox-label {
		cursor: pointer;
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
		font-size: 0.9rem;
		color: #333;
	}

	.checkbox-label input[type='checkbox'] {
		margin-right: 0.5rem;
		width: 1rem;
		height: 1rem;
		outline: none; /* Remove the outline */
		box-shadow: none; /* Remove any box-shadow */
		-webkit-appearance: none; /* Override default appearance */
		cursor: pointer;
	}

	button {
		min-width: 50px;
	}
</style>
