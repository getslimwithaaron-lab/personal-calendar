-- Phase 24: Add columns to users table for billing, auth, and family features

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text DEFAULT 'owner';
ALTER TABLE users ADD COLUMN IF NOT EXISTS family_id uuid REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'trialing';
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Invites table
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  inviter_id uuid NOT NULL REFERENCES users(id),
  family_id uuid NOT NULL,
  email text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
