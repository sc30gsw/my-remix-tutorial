import { Form, Link, json, useFetcher, useLoaderData } from '@remix-run/react'
import { type FunctionComponent } from 'react'

import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { type ContactRecord, getContact, updateContact } from '../data'

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  const formData = await request.formData()
  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true',
  })
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  const contact = await getContact(params.contactId)

  if (!contact) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ contact })
}

const Contact = () => {
  const { contact } = useLoaderData<typeof loader>()

  return (
    <div id="contact" className="flex justify-start">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
          className="rounded-3xl"
        />
      </div>

      <div className="ml-4">
        <h1 className="text-4xl font-bold flex items-center">
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p className="my-2 text-xl text-blue-500 hover:underline">
            <Link to={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </Link>
          </p>
        ) : null}

        {contact.notes ? <p className="mt-4">{contact.notes}</p> : null}

        <div className="flex justify-start items-center mt-4">
          <Form action="edit">
            <button
              type="submit"
              className="mr-1 bg-white text-blue-500 border rounded-md py-2 px-4 shadow-xl hover:opacity-80"
            >
              Edit
            </button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                'Please confirm you want to delete this record.',
              )
              if (!response) {
                event.preventDefault()
              }
            }}
          >
            <button
              type="submit"
              className="ml-1 bg-white text-red-500 border rounded-md py-2 px-4 shadow-xl hover:opacity-80"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, 'favorite'>
}> = ({ contact }) => {
  const fetcher = useFetcher()
  // optimistic UI
  const favorite = fetcher.formData
    ? fetcher.formData.get('favorite') === 'true'
    : contact.favorite

  return (
    <fetcher.Form method="post" className="ml-4">
      <button
        type="submit"
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name="favorite"
        value={favorite ? 'false' : 'true'}
        className="text-yellow-500 text-2xl"
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}

export default Contact
