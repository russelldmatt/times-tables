export const numberWords: Record<string, number> = {
	zero: 0,
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
	ten: 10,
	eleven: 11,
	twelve: 12,
	thirteen: 13,
	fourteen: 14,
	fifteen: 15,
	sixteen: 16,
	seventeen: 17,
	eighteen: 18,
	nineteen: 19,
	twenty: 20,
	thirty: 30,
	forty: 40,
	fifty: 50,
	sixty: 60,
	seventy: 70,
	eighty: 80,
	ninety: 90,
	hundred: 100
};

export function parseSpokenNumber(text: string): number | null {
	if (!text) return null;

	// Return null if input contains any punctuation
	if (/[.,\-]/.test(text)) return null;

	// If it's a pure number, parse it
	if (/^\d+$/.test(text)) {
		return parseInt(text, 10);
	}

	// Normalize input text
	text = text
		.toLowerCase()
		.replace(/\s+/g, ' ') // Normalize multiple spaces
		.trim();

	// Handle simple numbers (e.g. "eight", "twelve")
	if (numberWords[text] !== undefined) return numberWords[text];

	// Split into words
	const parts = text.split(' ');

	// Handle "hundred" patterns
	if (parts.includes('hundred')) {
		const hundredsIndex = parts.indexOf('hundred');

		// Must have a number before "hundred"
		if (hundredsIndex === 0) return null;

		const hundreds = numberWords[parts[hundredsIndex - 1]];
		if (hundreds === undefined || hundreds > 9) return null;

		let result = hundreds * 100;

		// If there are more numbers after hundred
		if (hundredsIndex < parts.length - 1) {
			// Skip "and" if present
			const remainingParts = parts.slice(hundredsIndex + 1);
			if (remainingParts[0] === 'and') remainingParts.shift();

			// Parse the rest as a compound number
			const remainingText = remainingParts.join(' ');
			const remainder = parseSpokenNumber(remainingText);
			if (remainder === null || remainder >= 100) return null;

			result += remainder;
		}

		return result;
	}

	// Handle compound numbers like "twenty three" or "twenty and three"
	if (parts.length === 2 || (parts.length === 3 && parts[1] === 'and')) {
		const first = numberWords[parts[0]];
		const second = numberWords[parts[parts.length - 1]];

		// Only allow tens (20-90) followed by ones (1-9)
		if (first !== undefined && second !== undefined) {
			if (first >= 20 && first <= 90 && second >= 1 && second <= 9) {
				return first + second;
			}
		}
	}

	return null;
}
