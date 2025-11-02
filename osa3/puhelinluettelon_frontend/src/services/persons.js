import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(res => {
    return res.data
  })
}

const createPerson = (person) => {
  return axios.post(baseUrl, person).then(res => {
    return res.data
  })
}

const updatePerson = (id, person) => {
  return axios.put(`${baseUrl}/${id}`, person).then(res => {
    return res.data
  })
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(res => {
    return res.data
  })
}

export default { getAll, createPerson, updatePerson, deletePerson }