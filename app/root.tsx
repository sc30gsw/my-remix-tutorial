import {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from '@remix-run/node'
import stylesheet from './app.css'

import {
  Form,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from '@remix-run/react'
import { useEffect } from 'react'
import { CiSearch } from 'react-icons/ci'
import { SiRemix } from 'react-icons/si'
import { Spinner } from '~/components/Spinner'
import { createEmptyContact, getContacts } from '~/data'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Remix Tutorial',
      description: 'A tutorial for Remix',
    },
  ]
}

export const action = async () => {
  const contact = await createEmptyContact()
  return redirect(`/contacts/${contact.id}/edit`)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const contacts = await getContacts(q)
  return json({ contacts, q })
}

const App = () => {
  const { contacts, q } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const submit = useSubmit()

  useEffect(() => {
    const searchField = document.getElementById('q')

    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || ''
    }
  }, [q])

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans">
        <div className="min-h-dvh flex">
          <div id="sidebar" className="bg-zinc-200 w-96 h-dvh relative">
            <div className="flex p-4 items-center justify-center border-b border-b-zinc-400 h-24">
              <Form
                id="search-form"
                role="search"
                className="mr-2 bg-white flex items-center justify-around rounded-md p-2 shadow-xl"
                onChange={(event) => {
                  submit(event.currentTarget)
                }}
              >
                <CiSearch size={18} className="text-zinc-400" />
                <input
                  id="q"
                  aria-label="Search contacts"
                  defaultValue={q || ''}
                  placeholder="Search"
                  type="search"
                  name="q"
                  className="ml-2 outline-none"
                />
                <div id="search-spinner" aria-hidden={true} hidden={true} />
              </Form>
              <Form method="post">
                <button
                  type="submit"
                  className="bg-white text-blue-400 shadow-xl py-2 px-3 rounded-md"
                >
                  New
                </button>
              </Form>
            </div>
            <nav className="px-6 pt-6 h-[calc(100vh-48px-96px)] overflow-scroll hidden-scrollbar">
              {contacts.length ? (
                <ul className="flex flex-col gap-4">
                  {contacts.map((contact) => (
                    <li key={contact.id}>
                      <NavLink
                        className={({ isActive, isPending }) =>
                          isActive
                            ? 'inline-block bg-blue-600 text-white py-2 px-1 w-full cursor-pointer rounded-md'
                            : isPending
                              ? 'ease-in-out duration-700 inline-block text-black py-2 px-1 w-full bg-indigo-300 rounded-md transition'
                              : 'inline-block bg-transparent text-black py-2 px-1 w-full cursor-pointer rounded-md hover:bg-neutral-300'
                        }
                        to={`contacts/${contact.id}`}
                      >
                        {contact.first || contact.last ? (
                          <span>
                            {contact.first} {contact.last}
                          </span>
                        ) : (
                          <i className="text-gray-400">No Name</i>
                        )}
                        {contact.favorite ? <span>★</span> : null}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  <i>No contacts</i>
                </p>
              )}
            </nav>
            <h1 className="border-t border-zinc-400 flex h-12 items-center pl-12 w-full">
              <SiRemix size={26} className="mr-2 shadow-xl" />
              Remix Contacts
            </h1>
          </div>
          <div
            id="detail"
            className="pl-10 pt-10 w-full flex flex-col gap-5 z-10"
          >
            {navigation.state === 'loading' ? <Spinner /> : <Outlet />}
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default App
