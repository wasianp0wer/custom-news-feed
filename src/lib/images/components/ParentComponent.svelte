<script lang="ts">
	import ChildComponent from './ChildComponent.svelte';

	// Handler for receiving updates from the child
	function handleUpdate(count: number): void {
		console.log('Parent received:', count);
	}
</script>

<div class="parent">
	<h2>Parent Component</h2>
	<ChildComponent initialCount={5} currentCount={handleUpdate} />
</div>

<style>
	.parent {
		border: 2px dashed #4caf50;
		padding: 1rem;
		border-radius: 8px;
		margin-top: 1rem;
	}
</style>
