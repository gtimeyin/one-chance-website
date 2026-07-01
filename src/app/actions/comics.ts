"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addPanel,
  createComicRecord,
  deleteComicRecord,
  deletePanel,
  getComicById,
  reorderPanels,
  requireCreatorSession,
  updateComicRecord,
  updatePanel,
  uploadComicImage,
} from "@/lib/comics-data";
import type { FormState } from "@/lib/auth-definitions";
import { createLogger } from "@/lib/logger";

const log = createLogger("comic-actions");

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])?$/;

function bust(comic?: { slug?: string }) {
  revalidatePath("/account/admin/comics");
  revalidatePath("/comics");
  revalidatePath("/updates");
  if (comic?.slug) revalidatePath(`/comics/${comic.slug}`);
}

function fail(message: string, errors?: Record<string, string[]>): FormState {
  return { message, success: false, errors };
}

// ---- Create --------------------------------------------------------------

export async function createComic(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    await requireCreatorSession();
  } catch (e) {
    return fail((e as Error).message);
  }

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const episode = String(formData.get("episode") ?? "").trim();

  const errors: Record<string, string[]> = {};
  if (!SLUG_RE.test(slug)) errors.slug = ["Use lowercase letters, numbers, and hyphens only (e.g. ep-1-road-to-riches)"];
  if (!title) errors.title = ["Title is required"];
  if (Object.keys(errors).length > 0) return fail("Please fix the errors below.", errors);

  try {
    const comic = await createComicRecord({ slug, title, subtitle, episode });
    bust(comic);
    redirect(`/account/admin/comics/${comic.id}`);
  } catch (e) {
    if ((e as { digest?: string }).digest?.toString().startsWith("NEXT_REDIRECT")) throw e;
    log.error("createComic failed", e);
    const message = /duplicate key/i.test((e as Error).message)
      ? "A comic with that slug already exists."
      : (e as Error).message || "Could not create comic.";
    return fail(message);
  }
}

// ---- Update metadata -----------------------------------------------------

export async function saveComicMeta(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    await requireCreatorSession();
  } catch (e) {
    return fail((e as Error).message);
  }

  const id = String(formData.get("id") ?? "");
  if (!id) return fail("Missing comic id.");

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const episode = String(formData.get("episode") ?? "").trim();
  const published = String(formData.get("published") ?? "") === "on";

  const errors: Record<string, string[]> = {};
  if (!SLUG_RE.test(slug)) errors.slug = ["Use lowercase letters, numbers, and hyphens only"];
  if (!title) errors.title = ["Title is required"];
  if (Object.keys(errors).length > 0) return fail("Please fix the errors below.", errors);

  try {
    await updateComicRecord(id, { slug, title, subtitle, episode, published });
    bust({ slug });
    return { message: "Saved.", success: true };
  } catch (e) {
    log.error("saveComicMeta failed", e);
    return fail((e as Error).message || "Could not save changes.");
  }
}

// ---- Delete --------------------------------------------------------------

export async function deleteComic(formData: FormData): Promise<void> {
  await requireCreatorSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing comic id");
  await deleteComicRecord(id);
  bust();
  redirect("/account/admin/comics");
}

// ---- Cover / thumbnail image upload -------------------------------------

export async function uploadComicCover(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    await requireCreatorSession();
  } catch (e) {
    return fail((e as Error).message);
  }

  const id = String(formData.get("id") ?? "");
  const kind = String(formData.get("kind") ?? "") as "grid" | "thumbnail";
  const file = formData.get("file") as File | null;
  if (!id || !file || file.size === 0) return fail("Choose an image file.");
  if (kind !== "grid" && kind !== "thumbnail") return fail("Unknown upload kind.");

  const comic = await getComicById(id);
  if (!comic) return fail("Comic not found.");

  try {
    const url = await uploadComicImage({ file, slug: comic.slug, folder: kind });
    await updateComicRecord(id, kind === "grid" ? { gridImage: url } : { image: url });
    bust(comic);
    return { message: `${kind === "grid" ? "Cover" : "Thumbnail"} updated.`, success: true };
  } catch (e) {
    log.error("uploadComicCover failed", e);
    return fail((e as Error).message || "Upload failed.");
  }
}

// ---- Panel management ---------------------------------------------------

export async function addPanelsAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    await requireCreatorSession();
  } catch (e) {
    return fail((e as Error).message);
  }

  const id = String(formData.get("comicId") ?? "");
  if (!id) return fail("Missing comic id.");
  const comic = await getComicById(id);
  if (!comic) return fail("Comic not found.");

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return fail("Choose one or more image files.");

  const startingSort = comic.panels.reduce((max, p) => Math.max(max, p.sort_order), -1) + 1;

  try {
    let i = 0;
    for (const file of files) {
      const url = await uploadComicImage({ file, slug: comic.slug, folder: "panels" });
      await addPanel(id, { src: url, sortOrder: startingSort + i });
      i++;
    }
    bust(comic);
    return { message: `Added ${files.length} panel${files.length === 1 ? "" : "s"}.`, success: true };
  } catch (e) {
    log.error("addPanelsAction failed", e);
    return fail((e as Error).message || "Upload failed.");
  }
}

export async function updatePanelCaption(formData: FormData): Promise<void> {
  await requireCreatorSession();
  const panelId = String(formData.get("panelId") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();
  const slug = String(formData.get("slug") ?? "");
  if (!panelId) throw new Error("Missing panel id");
  await updatePanel(panelId, { caption: caption || null });
  bust({ slug });
}

export async function deletePanelAction(formData: FormData): Promise<void> {
  await requireCreatorSession();
  const panelId = String(formData.get("panelId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!panelId) throw new Error("Missing panel id");
  await deletePanel(panelId);
  bust({ slug });
}

export async function movePanelAction(formData: FormData): Promise<void> {
  await requireCreatorSession();
  const comicId = String(formData.get("comicId") ?? "");
  const panelId = String(formData.get("panelId") ?? "");
  const direction = String(formData.get("direction") ?? "") as "up" | "down";
  const slug = String(formData.get("slug") ?? "");
  if (!comicId || !panelId || (direction !== "up" && direction !== "down")) {
    throw new Error("Bad move payload");
  }

  const comic = await getComicById(comicId);
  if (!comic) throw new Error("Comic not found");

  const ids = comic.panels.map((p) => p.id);
  const idx = ids.indexOf(panelId);
  if (idx === -1) return;
  const target = direction === "up" ? idx - 1 : idx + 1;
  if (target < 0 || target >= ids.length) return;

  const reordered = ids.slice();
  [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];

  await reorderPanels(reordered);
  bust({ slug });
}
