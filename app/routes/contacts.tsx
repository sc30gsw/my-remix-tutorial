import { LoaderFunctionArgs, defer, json, redirect } from '@remix-run/node'

import {
  Await,
  Form,
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from '@remix-run/react'
import { Suspense, useEffect } from 'react'
import { CiSearch } from 'react-icons/ci'
import { LuLoader2 } from 'react-icons/lu'
import { SiRemix } from 'react-icons/si'
import { Navbar } from '~/components/Navbar'
import { Spinner } from '~/components/Spinner'
import { createEmptyContact, getContacts } from '~/data'

export const action = async () => {
  const contact = await createEmptyContact()
  return redirect(`${contact.id}/edit`)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const contacts = getContacts(q)
  return defer({ contacts, q })
}

const ContactsPage = () => {
  const { contacts, q } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q')

  useEffect(() => {
    const searchField = document.getElementById('q')

    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || ''
    }
  }, [q])

  return (
    <div className="min-h-dvh flex">
      <div id="sidebar" className="bg-zinc-200 w-96 h-dvh relative">
        <div className="flex p-4 items-center justify-center border-b border-b-zinc-400 h-24">
          <Form
            id="search-form"
            role="search"
            className="mr-2 bg-white flex items-center justify-around rounded-md p-2 shadow-xl"
            onChange={(event) => {
              const isFirstSearch = q === null
              submit(event.currentTarget, { replace: !isFirstSearch })
            }}
          >
            {searching ? (
              <Spinner size={5} color="border-neutral-400" />
            ) : (
              <CiSearch size={18} className="text-zinc-400" />
            )}
            <input
              id="q"
              aria-label="Search contacts"
              defaultValue={q || ''}
              placeholder="Search"
              type="search"
              name="q"
              className="ml-2 outline-none"
            />
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
          <Suspense
            fallback={
              <LuLoader2
                size={32}
                className="animate-spin flex justify-center w-full text-blue-500"
              />
            }
          >
            <Await resolve={contacts}>
              {(contacts) => <Navbar contacts={contacts} />}
            </Await>
          </Suspense>
        </nav>
        <h1 className="border-t border-zinc-400 flex h-12 items-center pl-12 w-full">
          <SiRemix size={26} className="mr-2 shadow-xl" />
          Remix Contacts
        </h1>
      </div>
      <div id="detail" className="pl-10 pt-10 w-full flex flex-col gap-5 z-10">
        {navigation.state === 'loading' && !searching ? (
          <Spinner weight={4} my={16} />
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  )
}

export default ContactsPage
