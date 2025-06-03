import { assertEquals } from 'https://deno.land/std/assert/mod.ts';
import { describe, it } from 'https://deno.land/std/testing/bdd.ts';
import { parseSpokenNumber } from './parseSpokenNumber.ts';

describe('parseSpokenNumber', () => {
	// Test basic single word numbers
	it('handles basic number words', () => {
		assertEquals(parseSpokenNumber('zero'), 0);
		assertEquals(parseSpokenNumber('one'), 1);
		assertEquals(parseSpokenNumber('five'), 5);
		assertEquals(parseSpokenNumber('ten'), 10);
		assertEquals(parseSpokenNumber('fifteen'), 15);
		assertEquals(parseSpokenNumber('twenty'), 20);
	});

	// Test case insensitivity
	it('is case insensitive', () => {
		assertEquals(parseSpokenNumber('FIVE'), 5);
		assertEquals(parseSpokenNumber('Ten'), 10);
		assertEquals(parseSpokenNumber('FiFtEeN'), 15);
	});

	// Test compound numbers (20-99)
	it('handles compound numbers', () => {
		assertEquals(parseSpokenNumber('twenty one'), 21);
		assertEquals(parseSpokenNumber('thirty five'), 35);
		assertEquals(parseSpokenNumber('forty seven'), 47);
		assertEquals(parseSpokenNumber('fifty nine'), 59);
		assertEquals(parseSpokenNumber('ninety nine'), 99);
		assertEquals(parseSpokenNumber('one hundred forty four'), 144);
	});

	// Test numbers with 'and'
	it('handles numbers with "and"', () => {
		assertEquals(parseSpokenNumber('twenty and one'), 21);
		assertEquals(parseSpokenNumber('thirty and five'), 35);
		assertEquals(parseSpokenNumber('one hundred and forty four'), 144);
	});

	// Test numeric strings
	it('handles numeric strings', () => {
		assertEquals(parseSpokenNumber('0'), 0);
		assertEquals(parseSpokenNumber('1'), 1);
		assertEquals(parseSpokenNumber('21'), 21);
		assertEquals(parseSpokenNumber('99'), 99);
		assertEquals(parseSpokenNumber('1000'), 1000);
	});

	// Test edge cases and invalid inputs
	it('handles edge cases and invalid inputs', () => {
		// Empty or null inputs
		assertEquals(parseSpokenNumber(''), null);
		assertEquals(parseSpokenNumber('   '), null);

		// Invalid number words
		assertEquals(parseSpokenNumber('eleventy'), null);
		assertEquals(parseSpokenNumber('zillion'), null);

		// Invalid combinations
		assertEquals(parseSpokenNumber('twenty hundred'), null);
		assertEquals(parseSpokenNumber('ninety twelve'), null);

		// Extra spaces
		assertEquals(parseSpokenNumber('twenty  one'), 21);
		assertEquals(parseSpokenNumber('  thirty  five  '), 35);
	});

	// Test inputs with punctuation (should all return null)
	it('rejects inputs with punctuation', () => {
		assertEquals(parseSpokenNumber('1,000'), null);
		assertEquals(parseSpokenNumber('1.5'), null);
		assertEquals(parseSpokenNumber('-1'), null);
		assertEquals(parseSpokenNumber('1,23,456'), null);
		assertEquals(parseSpokenNumber('12.34.56'), null);
		assertEquals(parseSpokenNumber('twenty-one'), null);
		assertEquals(parseSpokenNumber('twenty.one'), null);
	});
});
