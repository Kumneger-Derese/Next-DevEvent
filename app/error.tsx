"use client"

import Link from "next/link"

type params = {
  error: Error & { digest?: string },
  reset: () => void
}


const Error = ({ error, reset }: params) => {
  return (
    <div className="min-h-screen m-auto w-full flex items-center justify-center">

      <div style={{

        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }} className="flex flex-col gap-4">
        <h1>Something went wrong</h1>
        <p className="mb-8 text-neutral-500">{error.message}</p>

        <div className="flex gap-x-4 w-full">
          <button
            className="bg-red-600 px-8 py-2 rounded-md"
            onClick={() => reset()}>
            Reset
          </button>

          <Link
            href={'/frontend/public'}
            className="bg-green-600 px-8 py-2 rounded-md">
            Home
          </Link>
        </div>

      </div>

    </div>
  )
}
export default Error