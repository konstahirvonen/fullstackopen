const Header = (props) => {

  return (
    <h1>{props.course.name}</h1>
  )
}

const Part = (props) => {

  return (
    <p>{props.part.name} {props.part.exercises}</p>
  )
}

const Content = (props) => {
  
  return (
    <div>
      {props.course.parts.map(part => (
        <Part key={part.id} part={part}/>
      ))}
    </div>
  )
}

const Total = (props) => {

  const initialValue = 0
  const total = props.course.parts.reduce(
    (s, p) => s + p.exercises, initialValue
  )

  return (
    <p>Number of exercises {total}</p>
  )
}

const Course = (props) => {
  return (
    <div>
      <Header course={props.course} />
      <Content course={props.course} />
      <Total course={props.course}/>
    </div>
  )
}

export default Course