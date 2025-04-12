import React, { FC } from 'react'

const Home: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Booking App</h1>
      <p className="text-xl text-gray-600">This is a simple booking application.</p>
    </div>
  )
}

export default Home
