// Share Results Utility
// Generates Wordle-style share text with emojis

/**
 * Convert attempt result to emoji representation
 * @param {Object} attempt - The attempt object with exists and correctSpot
 * @returns {string} - Emoji representation
 */
function attemptToEmoji(attempt) {
	const { exists, correctSpot } = attempt;
	let emoji = '';
	
	// Add correct position emojis (green circles)
	for (let i = 0; i < correctSpot; i++) {
		emoji += '🎯';
	}
	
	// Add exists but wrong position emojis (blue circles)
	for (let i = 0; i < exists - correctSpot; i++) {
		emoji += '🔵';
	}
	
	// Add empty slots (gray circles)
	const emptySlots = 4 - exists;
	for (let i = 0; i < emptySlots; i++) {
		emoji += '⚪';
	}
	
	return emoji;
}

/**
 * Generate share text in Wordle style
 * @param {Array} attempts - Array of attempt objects
 * @param {number} dayNumber - The day number
 * @param {boolean} won - Whether the game was won
 * @param {number} maxAttempts - Maximum attempts allowed
 * @returns {string} - Formatted share text
 */
export function generateShareText(attempts, dayNumber, won, maxAttempts = 10) {
	const attemptCount = attempts.length;
	const result = won ? `${attemptCount}/${maxAttempts}` : 'X/10';
	
	let shareText = `KrackTheKode Daily #${dayNumber} ${result}\n\n`;
	
	// Add emoji representation for each attempt
	attempts.forEach(attempt => {
		shareText += attemptToEmoji(attempt) + '\n';
	});
	
	// Add game URL
	shareText += '\nhttps://krackthekode.pyrrho.dev';
	
	return shareText;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export async function copyToClipboard(text) {
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			return true;
		} else {
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.position = 'fixed';
			textArea.style.left = '-999999px';
			textArea.style.top = '-999999px';
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			const result = document.execCommand('copy');
			textArea.remove();
			return result;
		}
	} catch (error) {
		console.error('Failed to copy to clipboard:', error);
		return false;
	}
}

/**
 * Share results to clipboard
 * @param {Array} attempts - Array of attempt objects
 * @param {number} dayNumber - The day number
 * @param {boolean} won - Whether the game was won
 * @param {number} maxAttempts - Maximum attempts allowed
 * @returns {Promise<boolean>} - Success status
 */
export async function shareResults(attempts, dayNumber, won, maxAttempts = 10) {
	const shareText = generateShareText(attempts, dayNumber, won, maxAttempts);
	return await copyToClipboard(shareText);
} 