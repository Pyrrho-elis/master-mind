import { expect, test } from '@playwright/test';

test('index page has expected title', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'KrackTheKode' })).toBeVisible();
});

test('game interface elements are present', async ({ page }) => {
	await page.goto('/');

	// Check for game elements
	await expect(page.getByText('Attempts: 0/10')).toBeVisible();
	await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
});

test('rules page is accessible', async ({ page }) => {
	await page.goto('/rules');
	await expect(page.getByRole('heading', { name: 'How To Play KrackTheKode' })).toBeVisible();
	await expect(page.getByText('Objective')).toBeVisible();
});

test('navigation works correctly', async ({ page }) => {
	await page.goto('/');

	// Navigate to rules
	await page.getByRole('link', { name: 'View game rules' }).click();
	await expect(page).toHaveURL('/rules');

	// Navigate back to game
	await page.getByRole('link', { name: 'Go back to game' }).click();
	await expect(page).toHaveURL('/');
});
