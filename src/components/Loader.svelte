<div class="loader">
	<img src="/favicon.png" alt="Loading..." />
</div>

<style>
	.loader {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		z-index: 1000; /* Ensure it is above other content */
	}

	.loader img {
		width: 100px;
		height: 100px;
		animation: fade 2s infinite;
	}

	@keyframes fade {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
