import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests for LEAP
 * Tests critical auth flows: login, logout, registration, forgot password
 */

test.describe('Authentication Flows @smoke', () => {

    test.beforeEach(async ({ page }) => {
        // Start fresh on login page
        await page.goto('login.html');
    });

    test('login page loads correctly', async ({ page }) => {
        // Verify page elements
        await expect(page).toHaveTitle(/Login.*LEAP/);
        await expect(page.locator('h1')).toContainText('Welcome');
        await expect(page.locator('#auth-desc')).toContainText('Sign in to LEAP');

        // Verify form elements exist
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.locator('#auth-submit-btn')).toBeVisible();
        await expect(page.locator('#forgot-btn')).toBeVisible();
    });

    test('shows validation error for empty fields', async ({ page }) => {
        // Click submit without filling anything
        await page.click('#auth-submit-btn');

        // Should show error
        const errorMsg = page.locator('#error-msg');
        await expect(errorMsg).toHaveClass(/visible/);
        await expect(errorMsg).toContainText('Please enter both email and password');
    });

    test('validates email domain (@servicenow.com only)', async ({ page }) => {
        // Try non-ServiceNow email
        await page.fill('#email', 'user@gmail.com');
        await page.fill('#password', 'password123');
        await page.click('#auth-submit-btn');

        // Should show domain error
        const errorMsg = page.locator('#error-msg');
        await expect(errorMsg).toHaveClass(/visible/);
        await expect(errorMsg).toContainText('Only @servicenow.com emails are allowed');
    });

    test('validates password length (minimum 6 chars)', async ({ page }) => {
        // Try short password
        await page.fill('#email', 'user@servicenow.com');
        await page.fill('#password', '12345');
        await page.click('#auth-submit-btn');

        // Should show password error
        const errorMsg = page.locator('#error-msg');
        await expect(errorMsg).toHaveClass(/visible/);
        await expect(errorMsg).toContainText('Password must be at least 6 characters');
    });

    test('Enter key in email field submits form', async ({ page }) => {
        await page.fill('#email', 'test@servicenow.com');
        await page.fill('#password', 'ValidPass123!');

        // Press Enter in email field
        await page.press('#email', 'Enter');

        // Should attempt to submit (will fail auth, but validates Enter key works)
        // We check for button state change
        await expect(page.locator('#auth-submit-btn')).toBeDisabled({ timeout: 1000 });
    });

    test('Enter key in password field submits form', async ({ page }) => {
        await page.fill('#email', 'test@servicenow.com');
        await page.fill('#password', 'ValidPass123!');

        // Press Enter in password field
        await page.press('#password', 'Enter');

        // Should attempt to submit
        await expect(page.locator('#auth-submit-btn')).toBeDisabled({ timeout: 1000 });
    });

    test('forgot password button exists and is clickable', async ({ page }) => {
        const forgotBtn = page.locator('#forgot-btn');

        // Verify button exists and is visible
        await expect(forgotBtn).toBeVisible();
        await expect(forgotBtn).toHaveText(/Forgot Password/);

        // Button should be enabled
        await expect(forgotBtn).toBeEnabled();
    });

    test('forgot password requires email', async ({ page }) => {
        // Click forgot password without email
        await page.click('#forgot-btn');

        // Should show error
        const errorMsg = page.locator('#error-msg');
        await expect(errorMsg).toHaveClass(/visible/);
        await expect(errorMsg).toContainText('Please enter your email address first');
    });

    test('can switch between login and signup modes', async ({ page }) => {
        // Start in login mode
        await expect(page.locator('#auth-title')).toContainText('Welcome');
        await expect(page.locator('#auth-submit-btn')).toHaveText('Login');

        // Click switch to signup
        await page.click('#auth-switch-btn');

        // Should switch to signup mode
        await expect(page.locator('#auth-title')).toContainText('Create Account');
        await expect(page.locator('#auth-submit-btn')).toHaveText('Sign Up');

        // Switch back to login
        await page.click('#auth-switch-btn');

        // Should be back in login mode
        await expect(page.locator('#auth-title')).toContainText('Welcome');
        await expect(page.locator('#auth-submit-btn')).toHaveText('Login');
    });

    test('login button has correct focus styling (no pink highlight)', async ({ page }) => {
        const submitBtn = page.locator('#auth-submit-btn');

        // Focus the button
        await submitBtn.focus();

        // Check that outline is removed (no browser default)
        const outline = await submitBtn.evaluate(el =>
            window.getComputedStyle(el).outline
        );

        // Should have outline:none (not browser default pink/blue)
        expect(outline).toContain('none');
    });

    test('displays correct version number', async ({ page }) => {
        // Check version display (be flexible with whitespace)
        const versionText = await page.locator('text=v6.3.0-chameleon-prime').textContent();
        expect(versionText.trim()).toBe('v6.3.0-chameleon-prime');
    });

    test('error messages are accessible', async ({ page }) => {
        const errorMsg = page.locator('#error-msg');

        // Should have role="alert" or aria-live for screen readers
        // Note: We should add this to login.html if not present
        const role = await errorMsg.getAttribute('role');
        const ariaLive = await errorMsg.getAttribute('aria-live');

        // At least one should be present for accessibility
        expect(role === 'alert' || ariaLive === 'polite').toBeTruthy();
    });
});

test.describe('Visual Checks', () => {
    test('login page has no console errors on load', async ({ page }) => {
        const consoleErrors = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto('login.html');

        // Wait a moment for any async errors
        await page.waitForTimeout(1000);

        // Should have no console errors
        expect(consoleErrors).toHaveLength(0);
    });

    test('login page has stars animation', async ({ page }) => {
        await page.goto('login.html');

        // Stars canvas should exist
        const starsCanvas = page.locator('#stars-canvas');
        await expect(starsCanvas).toBeVisible();

        // Canvas should have dimensions
        const width = await starsCanvas.evaluate(el => el.width);
        expect(width).toBeGreaterThan(0);
    });
});

test.describe('Form UX', () => {
    test('password field has correct autocomplete attribute', async ({ page }) => {
        await page.goto('login.html');

        const passwordInput = page.locator('#password');
        const autocomplete = await passwordInput.getAttribute('autocomplete');

        expect(autocomplete).toBe('current-password');
    });

    test('email field has correct autocomplete attribute', async ({ page }) => {
        await page.goto('login.html');

        const emailInput = page.locator('#email');
        const autocomplete = await emailInput.getAttribute('autocomplete');

        expect(autocomplete).toBe('username');
    });

    test('form inputs have proper placeholder text', async ({ page }) => {
        await page.goto('login.html');

        const emailPlaceholder = await page.locator('#email').getAttribute('placeholder');
        const passwordPlaceholder = await page.locator('#password').getAttribute('placeholder');

        expect(emailPlaceholder).toContain('@servicenow.com');
        expect(passwordPlaceholder).toContain('•'); // Password dots
    });
});
