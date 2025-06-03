<script lang="ts">
	import Flashcard from '$lib/Flashcard.svelte';
	import { parseSpokenNumber } from '$lib/parseSpokenNumber';

	const cellResults = $state<Record<string, 'correct' | 'wrong'>>({});

	const size = 12;
	let selected = $state<{ x: number; y: number } | null>(null);

	let spokenAnswer = $state<number | 'error' | null>(null);

	function selectCell(x: number, y: number) {
		selected = { x, y };
		spokenAnswer = null; // clear previous
		const utterance = new SpeechSynthesisUtterance(`${x} times ${y}`);
		utterance.lang = 'en-US';

		utterance.onend = () => {
			listenForAnswer(x * y);
		};

		speechSynthesis.cancel();
		speechSynthesis.speak(utterance);
	}

	function listenForAnswer(expected: number) {
		if (!('webkitSpeechRecognition' in window)) {
			alert('Speech recognition not supported.');
			return;
		}

		const recognition = new webkitSpeechRecognition(); // @ts-ignore
		recognition.lang = 'en-US';
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;

		recognition.onresult = (event) => {
			const spoken = event.results[0][0].transcript.trim();
			spokenAnswer = parseSpokenNumber(spoken);

			const isCorrect = spokenAnswer === expected;

			if (selected) {
				const key = `${selected.x},${selected.y}`;
				cellResults[key] = isCorrect ? 'correct' : 'wrong';
			}
		};

		recognition.onerror = (event) => {
			console.error('Speech error', event.error);
			// spokenAnswer = 'error';
		};

		recognition.start();
	}
</script>

<h1>Multiplication Practice Grid</h1>

<div class="table">
	<!-- Top-left empty corner -->
	<div class="cell header"></div>

	<!-- Top header row -->
	{#each Array(size) as _, x}
		<div class="cell header">{x + 1}</div>
	{/each}

	<!-- Main grid -->
	{#each Array(size) as _, y}
		<div class="cell header">{y + 1}</div>

		{#each Array(size) as _, x}
			<div
				class="cell {(() => {
					const key = `${x + 1},${y + 1}`;
					const result = cellResults[key];
					return result === 'correct' ? 'correct' : result === 'wrong' ? 'wrong' : '';
				})()}"
				on:click={() => selectCell(x + 1, y + 1)}
			>
				{x + 1} × {y + 1}
			</div>
		{/each}
	{/each}
</div>

<!-- Show flashcard if a cell is selected -->
{#if selected}
	<Flashcard
		front="{selected.x} × {selected.y}"
		back={selected.x * selected.y}
		expectedAnswer={selected.x * selected.y}
		{spokenAnswer}
	/>
{/if}

<style>
	.table {
		display: grid;
		grid-template-columns: repeat(13, auto);
		gap: 4px;
		text-align: center;
		font-family: sans-serif;
	}

	.cell {
		padding: 0.5rem;
		border: 1px solid #ccc;
		background-color: #eee;
		cursor: pointer;
		min-width: 40px;
	}

	.header {
		background-color: #ddd;
		font-weight: bold;
		cursor: default;
	}

	.correct {
		background-color: #c8f7c5; /* green */
	}
	.wrong {
		background-color: #f7c5c5; /* red */
	}
</style>
