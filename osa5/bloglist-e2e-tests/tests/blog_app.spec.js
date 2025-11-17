const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./test_helper')

const testUsername = 'testuser'
const testPassword = 'password'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test user',
        username: testUsername,
        password: testPassword
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'password')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'invalidpassword')
      await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
      await expect(page.getByText(/Login failed:\s/)).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, testUsername, testPassword)
      await createBlog(page, 'Test blog 1', 'Author 1', "https://blogs.com/test-blog-1")
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test blog 2', 'Author 2', "https://blogs.com/test-blog-2")
      await expect(page.getByText('Test blog 2 Author 2')).toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
      const blogLocator = page.getByText('Test blog 1 Author 1')
      likeBlog(blogLocator, 1)
      await expect(blogLocator.getByText('likes 1')).toBeVisible()
    })

    test('blog can be deleted', async ({ page }) => {
      page.on("dialog", async (dialog) => dialog.accept())
      const blogLocator = page.getByText('Test blog 1 Author 1')
      await blogLocator.getByRole('button', { name: 'view' }).click()
      await blogLocator.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByText('Removed blog Test blog 1 by Author 1')).toBeVisible()
      await expect(blogLocator).not.toBeVisible()
    })

    test('only blog creator can see the delete button', async ({ page, request }) => {
      // Create a second user
      await request.post('/api/users', {
        data: {
          name: 'Test user 2',
          username: 'testuser2',
          password: testPassword
        }
      })

      // Logout initial user and login second user
      await page.getByRole('button', { name: 'Logout' }).click()
      await loginWith(page, 'testuser2', testPassword)

      const blogLocator = page.getByText('Test blog 1 Author 1')
      await blogLocator.getByRole('button', { name: 'view' }).click()
      await expect(blogLocator.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })

    test('blogs are ordered by likes descending', async ({ page }) => {
      const blogCount = 5 // Including the one created in beforeEach
      for (let i = 2; i <= blogCount; i++) {
        await createBlog(page, `Test blog ${i}`, `Author ${i}`, `https://blogs.com/test-blog-${i}`)
        const blogLocator = page.getByText(`Test blog ${i} Author ${i}`)
        await likeBlog(blogLocator, i) // first one gets least likes
      }
      
      // Order should be: blog 5, blog 4, blog 3, blog 2, blog 1
      const blogLocators = page.getByText(/^Test blog \d+ Author \d+ \s/)
      for (let i = 0; i < await blogLocators.count(); i++) {
        await expect(blogLocators.nth(i)).toHaveText(`Test blog ${blogCount - i} Author ${blogCount - i}`)
      }
    })
  })
})