// Daily Challenge System
// Generates the same code for everyone on the same day

const DAILY_SEED_BASE = 20250101; // Base date for consistent seeding

/**
 * Generate a deterministic daily code based on the date
 * @param {Date} date - The date to generate code for
 * @returns {string} - 4-digit code
 */
export function generateDailyCode(date = new Date()) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // getMonth() returns 0-11
	const day = date.getDate();
	
	// Create a unique seed for this date
	const dateSeed = year * 10000 + month * 100 + day;
	const dailySeed = dateSeed - DAILY_SEED_BASE;
	
	// Use the seed to generate a deterministic code
	return generateCodeFromSeed(dailySeed);
}

/**
 * Generate a code from a specific seed
 * @param {number} seed - The seed to use
 * @returns {string} - 4-digit code
 */
function generateCodeFromSeed(seed) {
	// Simple but effective seeded random number generator
	let currentSeed = seed;
	
	function seededRandom() {
		currentSeed = (currentSeed * 9301 + 49297) % 233280;
		return currentSeed / 233280;
	}
	
	// Generate 4 unique digits from 1-9
	const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const code = [];
	
	for (let i = 0; i < 4; i++) {
		const index = Math.floor(seededRandom() * digits.length);
		code.push(digits[index]);
		digits.splice(index, 1);
	}
	
	return code.join('');
}

/**
 * Get today's daily code
 * @returns {string} - Today's 4-digit code
 */
export function getTodayCode() {
	return generateDailyCode(new Date());
}

/**
 * Get the daily code for a specific date
 * @param {Date} date - The date to get code for
 * @returns {string} - The 4-digit code for that date
 */
export function getCodeForDate(date) {
	return generateDailyCode(date);
}

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} - True if the date is today
 */
export function isToday(date) {
	const today = new Date();
	return date.getFullYear() === today.getFullYear() &&
		   date.getMonth() === today.getMonth() &&
		   date.getDate() === today.getDate();
}

/**
 * Get the day number since the base date
 * @param {Date} date - The date to calculate for
 * @returns {number} - Days since base date
 */
export function getDayNumber(date = new Date()) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const dateSeed = year * 10000 + month * 100 + day;
	return dateSeed - DAILY_SEED_BASE;
}

/**
 * Format a date for display
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Get the storage key for daily challenge completion
 * @param {number} dayNumber - The day number
 * @returns {string} - Storage key
 */
function getCompletionKey(dayNumber) {
	return `daily_challenge_${dayNumber}`;
}

/**
 * Check if daily challenge is completed for today
 * @returns {boolean} - True if completed today
 */
export function isDailyChallengeCompleted() {
	const dayNumber = getDayNumber();
	const key = getCompletionKey(dayNumber);
	
	try {
		const stored = localStorage.getItem(key);
		if (stored) {
			const data = JSON.parse(stored);
			const storedDate = new Date(data.date);
			return isToday(storedDate);
		}
		return false;
	} catch (error) {
		console.error('Error checking daily challenge completion:', error);
		return false;
	}
}

/**
 * Mark daily challenge as completed
 * @param {Array} attempts - Array of attempt objects
 * @param {boolean} won - Whether the game was won
 * @returns {boolean} - Success status
 */
export function markDailyChallengeCompleted(attempts, won) {
	const dayNumber = getDayNumber();
	const key = getCompletionKey(dayNumber);
	
	try {
		const data = {
			dayNumber,
			date: new Date().toISOString(),
			attempts,
			won,
			attemptCount: attempts.length
		};
		
		localStorage.setItem(key, JSON.stringify(data));
		return true;
	} catch (error) {
		console.error('Error saving daily challenge completion:', error);
		return false;
	}
}

/**
 * Get today's daily challenge data
 * @returns {Object|null} - Challenge data or null if not completed
 */
export function getTodayChallengeData() {
	const dayNumber = getDayNumber();
	const key = getCompletionKey(dayNumber);
	
	try {
		const stored = localStorage.getItem(key);
		if (stored) {
			const data = JSON.parse(stored);
			const storedDate = new Date(data.date);
			if (isToday(storedDate)) {
				return data;
			}
		}
		return null;
	} catch (error) {
		console.error('Error getting today\'s challenge data:', error);
		return null;
	}
} 