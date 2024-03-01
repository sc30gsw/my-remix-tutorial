import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { getContact, updateContact } from '../data'

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')

  const formData = await request.formData()
  const updates = Object.fromEntries(formData)

  await updateContact(params.contactId, updates)

  return redirect(`/contacts/${params.contactId}`)
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  const contact = await getContact(params.contactId)
  if (!contact) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ contact })
}

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>()

  return (
    <Form
      key={contact.id}
      id="contact-form"
      method="post"
      className="flex flex-col space-y-4"
    >
      <p className="flex items-center gap-20">
        <span>Name</span>
        <div className="w-full">
          <input
            defaultValue={contact.first}
            aria-label="First name"
            name="first"
            type="text"
            placeholder="First"
            className="border shadow-xl rounded-md p-2 w-48 outline-none"
          />
          <input
            aria-label="Last name"
            defaultValue={contact.last}
            name="last"
            placeholder="Last"
            type="text"
            className="border shadow-xl rounded-md p-2 w-48 ml-4 outline-none"
          />
        </div>
      </p>
      <label className="flex items-center gap-16">
        <span>Twitter</span>
        <div className="w-full">
          <input
            defaultValue={contact.twitter}
            name="twitter"
            placeholder="@jack"
            type="text"
            className="border shadow-xl rounded-md p-2 w-[calc(192px*2+16px)] ml-2 outline-none"
          />
        </div>
      </label>
      <label className="flex items-center w-full gap-10">
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
          className="border shadow-xl rounded-md p-2 w-[calc(192px*2+16px)] outline-none"
        />
      </label>
      <label className="flex items-start gap-20">
        <span>Notes</span>
        <textarea
          defaultValue={contact.notes}
          name="notes"
          rows={6}
          className="border shadow-xl rounded-md p-2 w-[calc(192px*2+16px)] outline-none"
        />
      </label>
      <p className="flex items-center gap-2 ml-32">
        <button
          type="submit"
          className="border bg-white text-blue-500 px-4 py-2 rounded-md shadow-xl"
        >
          Save
        </button>
        <button
          type="button"
          className="border bg-white text-black px-4 py-2 rounded-md shadow-xl"
        >
          Cancel
        </button>
      </p>
    </Form>
  )
}
