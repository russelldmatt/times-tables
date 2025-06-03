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
	ninety: 90
};

export function parseSpokenNumber(text: string): number | null {
	if (!text) return null;

	// Normalize input text
	text = text
		.toLowerCase()
		.replace(/-/g, ' ') // Convert hyphens to spaces
		.replace(/\s+/g, ' ') // Normalize multiple spaces
		.trim();

	// Handle simple numbers (e.g. "eight", "twelve")
	if (numberWords[text] !== undefined) return numberWords[text];

	// Handle compound numbers like "twenty three" or "twenty-three"
	const parts = text.split(' ');
	if (parts.length === 2) {
		const tens = numberWords[parts[0]];
		const ones = numberWords[parts[1]];
		if (tens >= 20 && tens <= 90 && ones >= 0 && ones <= 9) {
			return tens + ones;
		}
	}

	// Handle written numbers with "and" like "one hundred and twenty"
	const withoutAnd = text.replace(/\sand\s/g, ' ');
	const cleanParts = withoutAnd.split(' ');
	if (cleanParts.length > 1) {
		let result = 0;
		for (const part of cleanParts) {
			const value = numberWords[part];
			if (value !== undefined) {
				result += value;
			} else {
				result = 0;
				break;
			}
		}
		if (result > 0) return result;
	}

	// Try numeric fallback, handling various formats
	const numericText = text
		.replace(/[,\s]/g, '') // Remove commas and spaces
		.match(/^\d+$/); // Ensure only digits remain

	if (numericText) {
		const numeric = parseInt(numericText[0], 10);
		if (!isNaN(numeric) && numeric >= 0) return numeric;
	}

	return null;
}
