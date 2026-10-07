const Notification = ({ message }) => {
  if (message === null)  {
    return null
  }

  return (
    <div className='message'>
      {message}
    </div>
  )
}

const ErrorMessage = ({ errorMessage }) => {
    if (errorMessage === null) {
        return null
    }

    return (
        <div className="errorMessage">
            {errorMessage}
        </div>
    )
}
export {Notification, ErrorMessage}