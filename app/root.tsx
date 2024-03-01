import { LinksFunction } from '@remix-run/node'
import stylesheet from './app.css'

import {
  Form,
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

const App = () => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-serif">
        <div id="sidebar">
          <h1 className="text-blue-500 text-3xl font-bold">Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden={true} hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            <ul>
              <li>
                <a href="/contacts/1">Your Name</a>
              </li>
              <li>
                <a href="/contacts/2">Your Friend</a>
              </li>
            </ul>
          </nav>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default App
