const loginWith = async (page, username, password) => {
  await page.getByLabel('Username:').fill(username)
  await page.getByLabel('Password:').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create new blog' }).click()
  await page.getByLabel('Title:').fill(title)
  await page.getByLabel('Author:').fill(author)
  await page.getByLabel('URL:').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
  await page.getByText(`${title} ${author}`).waitFor()
}

const likeBlog = async (blogLocator, likeCount) => {
  await blogLocator.getByRole('button', { name: 'view' }).click()
  for (let i = 0; i < likeCount; i++) {
    await blogLocator.getByRole('button', { name: 'like' }).click()
    const likesLocator = await blogLocator.getByText(/likes \d+/).innerText()
    const intialLikes = parseInt(likesLocator.replace('likes ', ''))
    await blogLocator.getByText(`likes ${intialLikes + 1}`).waitFor()
  }
}

module.exports = { loginWith, createBlog, likeBlog }