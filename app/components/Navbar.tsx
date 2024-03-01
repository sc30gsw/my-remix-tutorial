import { FC } from 'react'

import { NavLink } from '@remix-run/react'
import { ContactRecord } from '~/data'

export const Navbar: FC<Readonly<{ contacts: ContactRecord[] }>> = ({
  contacts,
}) => {
  return (
    <>
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
                to={`${contact.id}`}
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
    </>
  )
}
