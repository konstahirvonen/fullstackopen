import { Alert } from "@mui/material"

const Notification = ({ message }) => {
  if (message === null)  {
    return null
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={message.type} className='message'>
      {message.text}
    </Alert>
  )
}

export { Notification }