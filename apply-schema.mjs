// apply-schema.mjs — run with: node apply-schema.mjs
// Connects directly to Supabase PostgreSQL and runs the migration SQL.

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mivtjdbjztnvtjixhwmh.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdnRqZGJqenRudnRqaXhod21oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEwMTAwOCwiZXhwIjoyMDkwNjc3MDA4fQ.XEtu3V0njgROSG9VkQy_0gQQakEnm6GWusxPscwszyg'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

const sql = readFileSync(
  './supabase/migrations/20260401000000_initial_schema.sql',
  'utf8'
)

console.log('Applying schema via Supabase RPC...')

// Split into individual statements and run via rpc('exec_sql') — if available
// Fall back to direct POST to the pg REST endpoint
const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
  },
  body: JSON.stringify({ query: sql }),
})

if (res.ok) {
  console.log('Schema applied successfully via exec_sql RPC.')
} else {
  const err = await res.text()
  console.log('exec_sql RPC not available:', err)
  console.log('')
  console.log('MANUAL STEP REQUIRED:')
  console.log('1. Go to https://supabase.com/dashboard/project/mivtjdbjztnvtjixhwmh/sql/new')
  console.log('2. Paste the contents of: supabase/migrations/20260401000000_initial_schema.sql')
  console.log('3. Click Run')
}
