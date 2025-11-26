import { useState, useImperativeHandle } from 'react'

const CreateBlogForm = ({ onSubmit, ref }) => {
  const emptyState = {
    title: '',
    author: '',
    url: ''
  }
  const [state, setState] = useState(emptyState)

  useImperativeHandle(ref, () => {
    return { resetForm }
  })

  const resetForm = () => {
    setState(emptyState)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title: state.title,
      author: state.author,
      url: state.url
    })
  }

  const handleFieldChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Title:{' '}
          <input
            type="text"
            name="title"
            value={state.title}
            onChange={handleFieldChange}
          />
        </label>
      </div>
      <div>
        <label>
          Author:{' '}
          <input
            type="text"
            name="author"
            value={state.author}
            onChange={handleFieldChange}
          />
        </label>
      </div>
      <div>
        <label>
          URL:{' '}
          <input
            type="text"
            name="url"
            value={state.url}
            onChange={handleFieldChange}
          />
        </label>
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default CreateBlogForm
