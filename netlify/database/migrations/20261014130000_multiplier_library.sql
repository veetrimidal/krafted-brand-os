CREATE TABLE brand_multiplier_sources (
 id uuid PRIMARY KEY,
 workspace_id uuid NOT NULL REFERENCES brand_workspaces(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK (kind IN ('file','text','link')),
 title text NOT NULL,
 source_type text NOT NULL DEFAULT 'Other',
 source_url text,
 extracted_text text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX brand_multiplier_sources_workspace ON brand_multiplier_sources(workspace_id,created_at DESC);

CREATE TABLE brand_multiplier_rounds (
 id uuid PRIMARY KEY,
 workspace_id uuid NOT NULL REFERENCES brand_workspaces(id) ON DELETE CASCADE,
 project_id uuid NOT NULL,
 parent_round_id uuid,
 idempotency_key uuid NOT NULL,
 title text NOT NULL,
 source_ids uuid[] NOT NULL DEFAULT '{}',
 config jsonb NOT NULL,
 result jsonb NOT NULL,
 revision integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(workspace_id,idempotency_key)
);
CREATE INDEX brand_multiplier_rounds_workspace ON brand_multiplier_rounds(workspace_id,created_at DESC);
