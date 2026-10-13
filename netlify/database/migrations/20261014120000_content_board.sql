CREATE TABLE brand_content_items (
 id uuid PRIMARY KEY,
 workspace_id uuid NOT NULL REFERENCES brand_workspaces(id) ON DELETE CASCADE,
 source_key text,
 status text NOT NULL DEFAULT 'Ideas' CHECK (status IN ('Ideas','Drafts','In Production','Review','Scheduled','Published')),
 data jsonb NOT NULL DEFAULT '{}'::jsonb,
 revision integer NOT NULL DEFAULT 1,
 archived_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX brand_content_source_once ON brand_content_items(workspace_id,source_key) WHERE source_key IS NOT NULL;
CREATE INDEX brand_content_workspace_status ON brand_content_items(workspace_id,status,updated_at DESC) WHERE archived_at IS NULL;
