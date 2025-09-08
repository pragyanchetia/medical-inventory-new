import React from 'react'
 
const AlertMessage = (alertmessage: string) => { 
  return (
    <div className='text-red-500 text-xl font-semibold'>
      {alertmessage}
    </div>
  )
}

export default AlertMessage
