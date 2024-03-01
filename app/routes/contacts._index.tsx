import { Link } from '@remix-run/react'

const Index = () => {
  return (
    <div className="h-full w-full flex flex-col items-center">
      <img src="remix.jpg" alt="remix" width={400} height={400} />
      <p
        id="index-page"
        className="flex flex-col items-center w-full h-full text-neutral-400 mt-4"
      >
        This is a demo for Remix.
        <br />
        <span>
          Check out
          <Link to="https://remix.run" className="underline">
            the docs at remix.run
          </Link>
          .
        </span>
      </p>
    </div>
  )
}

export default Index
