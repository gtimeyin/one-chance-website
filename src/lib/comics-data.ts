import "server-only";
import { getSupabaseClient } from "./supabase";
import { getOptionalSession, verifySession } from "./dal";
import { createLogger } from "./logger";

const log = createLogger("comics-data");

export interface ComicPanelRecord {
  id: string;
  src: string;
  caption: string | null;
  sort_order: number;
}

export interface ComicRecord {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  episode: string;
  image: string;
  gridImage: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  panels: ComicPanelRecord[];
}

interface ComicRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  episode: string;
  image: string;
  grid_image: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface PanelRow {
  id: string;
  comic_id: string;
  src: string;
  caption: string | null;
  sort_order: number;
}

function mapComic(row: ComicRow, panels: ComicPanelRecord[] = []): ComicRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    episode: row.episode,
    image: row.image,
    gridImage: row.grid_image,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    panels,
  };
}

// ---- Reads ---------------------------------------------------------------

export async function listComics(opts?: { includeUnpublished?: boolean }): Promise<ComicRecord[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  const query = client
    .from("comics")
    .select("*")
    .order("created_at", { ascending: false });

  if (!opts?.includeUnpublished) query.eq("published", true);

  const { data, error } = await query;
  if (error) {
    log.error("listComics failed", error);
    return [];
  }
  return (data as ComicRow[]).map((row) => mapComic(row));
}

export async function getComicBySlug(slug: string): Promise<ComicRecord | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data: comic, error } = await client
    .from("comics")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !comic) {
    if (error) log.error("getComicBySlug failed", error);
    return null;
  }

  const { data: panels, error: panelError } = await client
    .from("comic_panels")
    .select("id, src, caption, sort_order")
    .eq("comic_id", (comic as ComicRow).id)
    .order("sort_order", { ascending: true });

  if (panelError) log.error("getComicBySlug panels failed", panelError);

  return mapComic(comic as ComicRow, (panels ?? []) as ComicPanelRecord[]);
}

export async function getComicById(id: string): Promise<ComicRecord | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data: comic, error } = await client
    .from("comics")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !comic) {
    if (error) log.error("getComicById failed", error);
    return null;
  }

  const { data: panels } = await client
    .from("comic_panels")
    .select("id, src, caption, sort_order")
    .eq("comic_id", (comic as ComicRow).id)
    .order("sort_order", { ascending: true });

  return mapComic(comic as ComicRow, (panels ?? []) as ComicPanelRecord[]);
}

// ---- Creator guard -------------------------------------------------------

export async function isCurrentUserCreator(): Promise<boolean> {
  const session = await getOptionalSession();
  if (!session) return false;
  return isCreator(session.customerId, session.email);
}

async function isCreator(customerId: number, email: string | undefined): Promise<boolean> {
  // Env-var allowlist bootstrap: comma-separated ids and/or emails in
  // COMIC_CREATOR_CUSTOMER_IDS get creator access without needing a DB row.
  // Useful for granting yourself access on day 1 or in dev.
  const emailLower = email?.trim().toLowerCase() ?? "";
  const envAllowlist = (process.env.COMIC_CREATOR_CUSTOMER_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const entry of envAllowlist) {
    if (entry.includes("@") && entry.toLowerCase() === emailLower) return true;
    if (entry === String(customerId)) return true;
  }

  const client = getSupabaseClient();
  if (!client) return false;

  // Try customer_id first (cheaper — indexed column).
  const { data: byId, error: idErr } = await client
    .from("comic_creators")
    .select("customer_id")
    .eq("customer_id", customerId)
    .maybeSingle();
  if (idErr) {
    log.error("isCreator by customer_id lookup failed", idErr);
    return false;
  }
  if (byId) return true;

  // Fall back to email match (case-insensitive).
  if (!emailLower) return false;
  const { data: byEmail, error: emailErr } = await client
    .from("comic_creators")
    .select("email")
    .ilike("email", emailLower)
    .maybeSingle();
  if (emailErr) {
    log.error("isCreator by email lookup failed", emailErr);
    return false;
  }
  return Boolean(byEmail);
}

/** Ensures the current session belongs to a permitted comic creator.
 *  Redirects to /login if unauthenticated, or throws otherwise. */
export async function requireCreatorSession() {
  const session = await verifySession();
  if (!(await isCreator(session.customerId, session.email))) {
    throw new Error("Not authorized: you don't have comic-creator access.");
  }
  return session;
}

// ---- Writes (must be called from server actions after requireCreatorSession) ----

export async function createComicRecord(input: {
  slug: string;
  title: string;
  subtitle?: string;
  episode?: string;
}): Promise<ComicRecord> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase unavailable");

  const { data, error } = await client
    .from("comics")
    .insert({
      slug: input.slug,
      title: input.title,
      subtitle: input.subtitle ?? "",
      episode: input.episode ?? "",
    })
    .select("*")
    .single();

  if (error || !data) throw error ?? new Error("Failed to create comic");
  return mapComic(data as ComicRow);
}

export async function updateComicRecord(
  id: string,
  patch: Partial<{
    slug: string;
    title: string;
    subtitle: string;
    episode: string;
    image: string;
    gridImage: string;
    published: boolean;
  }>,
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase unavailable");

  const row: Record<string, unknown> = {};
  if (patch.slug !== undefined) row.slug = patch.slug;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.subtitle !== undefined) row.subtitle = patch.subtitle;
  if (patch.episode !== undefined) row.episode = patch.episode;
  if (patch.image !== undefined) row.image = patch.image;
  if (patch.gridImage !== undefined) row.grid_image = patch.gridImage;
  if (patch.published !== undefined) row.published = patch.published;
  if (Object.keys(row).length === 0) return;

  const { error } = await client.from("comics").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteComicRecord(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase unavailable");
  // Panel rows cascade via FK.
  const { error } = await client.from("comics").delete().eq("id", id);
  if (error) throw error;
}

export async function addPanel(
  comicId: string,
  panel: { src: string; caption?: string | null; sortOrder?: number },
): Promise<ComicPanelRecord> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase unavailable");

  let sortOrder = panel.sortOrder;
  if (sortOrder === undefined) {
    const { data: last } = await client
      .from("comic_panels")
      .select("sort_order")
      .eq("comic_id", comicId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    sortOrder = ((last as PanelRow | null)?.sort_order ?? -1) + 1;
  }

  const { data, error } = await client
    .from("comic_panels")
    .insert({
      comic_id: comicId,
      src: panel.src,
      caption: panel.caption ?? null,
      sort_order: sortOrder,
    })
    .select("id, src, caption, sort_order")
    .single();

  if (error || !data) throw error ?? new Error("Failed to add panel");
  return data as ComicPanelRecord;
}

export async function updatePanel(
  id: string,
  patch: Partial<{ src: string; caption: string | null; sortOrder: number }>,
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase unavailable");
  const row: Record<string, unknown> = {};
  if (patch.src !== undefined) row.src = patch.src;
  if (patch.caption !== undefined) row.caption = patch.caption;
  if (patch.sortOrder !== undefined) row.sort_order = patch.sortOrder;
  if (Object.keys(row).length === 0) return;
  const { error } = await client.from("comic_panels").update(row).eq("id", id);
  if (error) throw error;
}

export async function deletePanel(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase unavailable");
  const { error } = await client.from("comic_panels").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderPanels(orderedIds: string[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase unavailable");
  // Small batch — sequential updates are fine and avoid a race with unique
  // constraints if we ever add one.
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await client
      .from("comic_panels")
      .update({ sort_order: i })
      .eq("id", orderedIds[i]);
    if (error) throw error;
  }
}

// ---- Storage upload ------------------------------------------------------

export async function uploadComicImage(opts: {
  file: File;
  slug: string;
  folder: "grid" | "thumbnail" | "panels";
}): Promise<string> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase unavailable");

  const ext = extFromFile(opts.file);
  const nonce = Math.random().toString(36).slice(2, 10);
  const path = `${opts.slug}/${opts.folder}/${Date.now()}-${nonce}${ext}`;

  const { error } = await client.storage
    .from("comics")
    .upload(path, opts.file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: opts.file.type || undefined,
    });

  if (error) throw error;

  const { data } = client.storage.from("comics").getPublicUrl(path);
  return data.publicUrl;
}

function extFromFile(file: File): string {
  const name = file.name || "";
  const dot = name.lastIndexOf(".");
  if (dot === -1) {
    if (file.type === "image/png") return ".png";
    if (file.type === "image/webp") return ".webp";
    if (file.type === "image/gif") return ".gif";
    return ".jpg";
  }
  return name.slice(dot).toLowerCase();
}
