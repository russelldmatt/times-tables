<script lang="ts">
	let { front, back, expectedAnswer, spokenAnswer } = $props();

	const isCorrect = $derived(spokenAnswer === expectedAnswer);
	const wasHeard = $derived(spokenAnswer !== null);
	const displayAnswer = $derived(spokenAnswer === null ? '' : expectedAnswer);

	let flipped = $state(false);

	function toggleFlip() {
		flipped = !flipped;
	}

	// Reset flip when front or back changes
	$effect(() => {
		if (spokenAnswer !== null) {
			flipped = true;
		} else if (front || back) {
			flipped = false;
		}
	});
</script>

<div class="flashcard" on:click={toggleFlip}>
	<div class="inner" style="transform: rotateY({flipped ? 180 : 0}deg);">
		<!-- Front -->
		<div class="front neutral">
			{front}
		</div>

		<!-- Back -->
		<div class="back {wasHeard ? (isCorrect ? 'correct' : 'incorrect') : 'neutral'}">
			<div>{displayAnswer}</div>
			{#if wasHeard}
				<small style="margin-top: 0.5rem; font-size: 0.9rem;">
					You said: {spokenAnswer}
				</small>
			{/if}
		</div>
	</div>
</div>

<style>
	.flashcard {
		width: 220px;
		height: 140px;
		margin: 1rem auto; /* center horizontally */
		perspective: 1000px;
		cursor: pointer;
	}

	.inner {
		width: 100%;
		height: 100%;
		transition: transform 0.6s;
		transform-style: preserve-3d;
		transform-origin: center; /* <--- this is important */
		position: relative;
	}

	.front,
	.back {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: bold;
		backface-visibility: hidden;
		border: 2px solid #333;
		border-radius: 0.5rem;
		box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
		padding: 0.5rem;
		text-align: center;
	}

	.back {
		transform: rotateY(180deg);
	}

	.correct {
		background-color: #c8f7c5; /* green */
	}

	.incorrect {
		background-color: #f7c5c5; /* red */
	}

	.neutral {
		background-color: #fff;
	}
</style>
