const Persons = ({ persons, onDelete }) => {
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
          <PersonRow
            key={p.id}
            name={p.name}
            number={p.number} 
            onDelete={() => onDelete(p.id)} 
          />
        )}
      </tbody>
    </table>
  )
}

const PersonRow = ({ name, number, onDelete }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{number}</td>
      <td><button onClick={onDelete}>delete</button></td>
    </tr>
  )
}

export default Persons