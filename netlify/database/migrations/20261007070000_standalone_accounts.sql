CREATE TABLE brand_accounts (
 id text PRIMARY KEY,
 email text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE brand_subscriptions (
 account_id text PRIMARY KEY REFERENCES brand_accounts(id) ON DELETE CASCADE,
 provider text NOT NULL,
 external_id text UNIQUE NOT NULL,
 status text NOT NULL DEFAULT 'inactive',
 paid_until timestamptz,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE brand_workspaces (
 id uuid PRIMARY KEY,
 account_id text NOT NULL REFERENCES brand_accounts(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK (kind IN ('founder','client')),
 name text NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
 data jsonb NOT NULL DEFAULT '{}'::jsonb,
 revision integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX brand_founder_per_account ON brand_workspaces(account_id) WHERE kind='founder';
CREATE INDEX brand_workspaces_owner ON brand_workspaces(account_id);
CREATE TABLE brand_ai_usage (
 account_id text NOT NULL REFERENCES brand_accounts(id) ON DELETE CASCADE,
 minute timestamptz NOT NULL,
 requests integer NOT NULL DEFAULT 1,
 PRIMARY KEY(account_id,minute)
);
