const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../src/utils/list_helper')

test('dummy returns one', () => {
  const result = listHelper.dummy([])
  assert.strictEqual(result, 1)
})

const blogs = [{
  _id: '1',
  title: 'First blog',
  author: 'Author 1',
  url: 'https://example.com/1',
  likes: 5
}, {
  _id: '2',
  title: 'Second blog',
  author: 'Author 2',
  url: 'https://example.com/2',
  likes: 10
}, {
  _id: '3',
  title: 'Third blog',
  author: 'Author 1',
  url: 'https://example.com/3',
  likes: 23
}, {
  _id: '4',
  title: 'Fourth blog',
  author: 'Author 1',
  url: 'https://example.com/4',
  likes: 12
}]

describe('total likes', () => {
  test('of an empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('of an undefined list is zero', () => {
    assert.equal(listHelper.totalLikes(undefined), 0)
  })

  test('of a list of one blog is count of that one blog', () => {
    const blog = blogs[0]
    assert.strictEqual(listHelper.totalLikes([blog]), blog.likes)
  })

  test('of a list of many blogs is sum of likes', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 50)
  })
})

describe('favorite blog', () => {
  [null, undefined, []].map((blogs) => {
    test(`in '${blogs}' list is null`, () => {
      assert.equal(listHelper.favoriteBlog(blogs), null)
    })
  })

  test('in list is the one with most likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
  })

  test('in list with two blogs with same amout of likes is either of them', () => {
    const blogs = [{
      _id: '1',
      title: 'First blog',
      author: 'Author 1',
      url: 'https://example.com/1',
      likes: 5
    }, {
      _id: '2',
      title: 'Second blog',
      author: 'Author 2',
      url: 'https://example.com/2',
      likes: 23
    }, {
      _id: '3',
      title: 'Second blog',
      author: 'Author 3',
      url: 'https://example.com/2',
      likes: 23
    }]

    const favorite = listHelper.favoriteBlog(blogs)
    assert.ok(favorite === blogs[1] || favorite === blogs[2])
  })
})

describe('author with most blogs', () => {
  [null, undefined, []].map((blogs) => {
    test(`in '${blogs}' list is null`, () => {
      assert.equal(listHelper.mostBlogs(blogs), null)
    })
  })

  test('in list should be Author 1 having 3', () => {
    const expectedResult = {
      author: 'Author 1',
      blogs: 3
    }
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), expectedResult)
  })
})

describe('author with most likes', () => {
  [null, undefined, []].map((blogs) => {
    test(`in '${blogs}' list is null`, () => {
      assert.equal(listHelper.mostLikes(blogs), null)
    })
  })

  test('in list should be Author 1 having 40', () => {
    const expectedResult = {
      author: 'Author 1',
      likes: 40
    }
    assert.deepStrictEqual(listHelper.mostLikes(blogs), expectedResult)
  })
})