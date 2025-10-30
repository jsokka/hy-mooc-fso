const Persons = ({ persons }) => {
  return (
    <table>
      <thead align="left">
        <tr>
          <th>Name</th>
          <th>Number</th>
        </tr>
      </thead>
      <tbody>
        {persons.map(p =>
          <PersonRow key={p.name} name={p.name} number={p.number} />
        )}
      </tbody>
    </table>
  )
}

const PersonRow = ({ key, name, number }) => {
  return (
    <tr key={key}>
      <td >{name}</td>
      <td>{number}</td>
    </tr>
  )
}

export default Persons