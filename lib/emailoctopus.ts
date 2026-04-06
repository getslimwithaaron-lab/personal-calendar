const API_BASE = 'https://emailoctopus.com/api/1.6'

function getApiKey() {
  const key = process.env.EMAILOCTOPUS_API_KEY
  if (!key) throw new Error('EMAILOCTOPUS_API_KEY not set')
  return key
}

function getListId() {
  const id = process.env.EMAILOCTOPUS_LIST_ID
  if (!id) throw new Error('EMAILOCTOPUS_LIST_ID not set')
  return id
}

export async function addContactToList(
  email: string,
  fields: Record<string, string> = {},
  tags: string[] = []
) {
  const res = await fetch(`${API_BASE}/lists/${getListId()}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: getApiKey(),
      email_address: email,
      fields,
      tags,
      status: 'SUBSCRIBED',
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    // MEMBER_EXISTS_WITH_EMAIL_ADDRESS is fine — user already on list
    if (err?.error?.code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') return { alreadyExists: true }
    console.error('EmailOctopus addContact error:', err)
    return { error: err }
  }

  return { success: true }
}

export async function addSignupContact(email: string, name: string) {
  return addContactToList(email, { FirstName: name }, ['signup', 'welcome'])
}

export async function addInviteContact(email: string, inviteLink: string, inviterName: string) {
  return addContactToList(
    email,
    { FirstName: '', InviteLink: inviteLink, InviterName: inviterName },
    ['invite']
  )
}
