import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const testBlog = {
    title: 'Test Blog',
    author: 'Blog Author',
    url: 'https://blogs.com/test-blog',
    likes: 213,
    user: {
      id: 'oaldabda',
      username: 'testuser',
      name: 'Test User'
    }
  }

  const assertBasicInfo = () => {
    const titleEl = screen.getByText(testBlog.title, { exact: false })
    expect(titleEl).toBeDefined()
    const authorEl = screen.getByText(testBlog.author, { exact: false })
    expect(authorEl).toBeDefined()
  }

  test('Title and author are visible by default', () => {
    render(<Blog blog={testBlog} />)

    assertBasicInfo()
  })

  test('Extended info is shown when show button clicked', async () => {
    const user = userEvent.setup()
    render(<Blog blog={testBlog} />)
    const viewButton = screen.getByText('view')

    await user.click(viewButton)

    assertBasicInfo()
    const urlEl = screen.getByText(testBlog.url)
    expect(urlEl).toBeDefined()
    const likesEl = screen.getByText(`likes ${testBlog.likes}`, { exact: false })
    expect(likesEl).toBeDefined()
    const userEl = screen.getByText(testBlog.user.name)
    expect(userEl).toBeDefined()
  })

  test('onLike event called when like button clicked', async() => {
    const user = userEvent.setup()
    const mockOnLike = vi.fn()

    render(<Blog blog={testBlog} onLike={mockOnLike} />)

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockOnLike.mock.calls).toHaveLength(2)
  })
})