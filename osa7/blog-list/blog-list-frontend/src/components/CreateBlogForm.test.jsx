import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('onSubmit is called when form is submitted', async () => {
  const user = userEvent.setup()
  const mockOnSubmit = vi.fn()

  const expectedBlog = {
    title: 'Test blog',
    author: 'Test Author',
    url: 'https://blogs.com/test-blog'
  }

  render(<CreateBlogForm onSubmit={mockOnSubmit} />)

  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('URL:')

  await user.type(titleInput, expectedBlog.title)
  await user.type(authorInput, expectedBlog.author)
  await user.type(urlInput, expectedBlog.url)

  const createButton = screen.getByText('Create')
  await user.click(createButton)

  expect(mockOnSubmit.mock.calls).toHaveLength(1)
  expect(mockOnSubmit.mock.calls[0][0]).toStrictEqual(expectedBlog)
})
