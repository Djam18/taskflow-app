import { test, expect } from '@playwright/test';

// TaskFlow E2E tests with Playwright
// Coverage: board CRUD, drag-drop, auth, real-time sync
// Coverage goal: 85% unit + integration + E2E combined

test.describe('Board Management', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as test user
    await page.goto('/');
    await page.fill('[data-testid="email-input"]', 'test@taskflow.dev');
    await page.fill('[data-testid="password-input"]', 'testpassword');
    await page.click('[data-testid="signin-btn"]');
    await expect(page).toHaveURL(/\/boards/);
  });

  test('should show empty state when no boards exist', async ({ page }) => {
    await expect(page.locator('[data-testid="empty-boards"]')).toBeVisible();
    await expect(page.locator('[data-testid="create-board-prompt"]')).toContainText(/create your first board/i);
  });

  test('should create a new board', async ({ page }) => {
    await page.click('[data-testid="create-board-btn"]');
    await page.fill('[data-testid="board-title-input"]', 'Q1 Roadmap');
    await page.fill('[data-testid="board-description-input"]', 'Product roadmap for Q1 2026');
    await page.click('[data-testid="create-board-submit"]');

    await expect(page.locator('[data-testid="board-card"]').first()).toContainText('Q1 Roadmap');
  });

  test('should open board and show default columns', async ({ page }) => {
    await page.click('[data-testid="board-card"]');
    await expect(page).toHaveURL(/\/board\//);

    await expect(page.locator('[data-testid="column"]')).toHaveCount(3);
    await expect(page.locator('[data-testid="column-title"]').first()).toContainText('To Do');
  });

  test('should add a card to a column', async ({ page }) => {
    await page.click('[data-testid="board-card"]');
    await page.click('[data-testid="add-card-btn"]');
    await page.fill('[data-testid="card-title-input"]', 'Build E2E tests');
    await page.keyboard.press('Enter');

    await expect(page.locator('[data-testid="card"]').first()).toContainText('Build E2E tests');
  });

  test('should drag a card between columns', async ({ page }) => {
    await page.click('[data-testid="board-card"]');

    const card = page.locator('[data-testid="card"]').first();
    const targetColumn = page.locator('[data-testid="column"]').nth(1); // In Progress

    // Drag from "To Do" to "In Progress"
    await card.dragTo(targetColumn);

    // Card should now be in the second column
    const inProgressCards = page.locator('[data-testid="column"]').nth(1).locator('[data-testid="card"]');
    await expect(inProgressCards).toHaveCount(1);
  });
});

test.describe('Real-time Sync', () => {
  test('should sync board changes between two browser contexts', async ({ browser }) => {
    // Open two tabs as the same user
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Both navigate to same board
    const boardUrl = '/board/test-board-id';
    await page1.goto(boardUrl);
    await page2.goto(boardUrl);

    // Page 1 adds a card
    await page1.click('[data-testid="add-card-btn"]');
    await page1.fill('[data-testid="card-title-input"]', 'Synced card');
    await page1.keyboard.press('Enter');

    // Page 2 should see the new card (Firebase real-time)
    await expect(page2.locator('[data-testid="card"]').filter({ hasText: 'Synced card' }))
      .toBeVisible({ timeout: 5000 });

    await context1.close();
    await context2.close();
  });
});

test.describe('Tanstack Query Integration', () => {
  test('should show cached boards without loading state on second visit', async ({ page }) => {
    // First visit — loading state expected
    await page.goto('/boards');
    await expect(page.locator('[data-testid="boards-loading"]')).toBeVisible();
    await expect(page.locator('[data-testid="board-card"]')).toBeVisible({ timeout: 3000 });

    // Navigate away
    await page.goto('/profile');

    // Navigate back — data should be cached (staleTime: 30s)
    await page.goto('/boards');

    // No loading spinner on second visit (Tanstack Query cache hit)
    await expect(page.locator('[data-testid="boards-loading"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="board-card"]')).toBeVisible();
  });
});
