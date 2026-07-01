import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { getComicById, isCurrentUserCreator } from "@/lib/comics-data";
import {
  deletePanelAction,
  movePanelAction,
  updatePanelCaption,
} from "@/app/actions/comics";
import EditMetaForm from "./EditMetaForm";
import CoverUploadForm from "./CoverUploadForm";
import AddPanelsForm from "./AddPanelsForm";

export const metadata = {
  title: "Edit comic",
  robots: { index: false, follow: false },
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditComicPage({ params }: EditPageProps) {
  if (!(await isCurrentUserCreator())) redirect("/account");

  const { id } = await params;
  const comic = await getComicById(id);
  if (!comic) notFound();

  return (
    <div className="flex flex-col" style={{ gap: 32 }}>
      <div className="flex items-center justify-between" style={{ gap: 12 }}>
        <div className="flex flex-col" style={{ gap: 4 }}>
          <Link
            href="/account/admin/comics"
            className="type-caption no-underline"
            style={{ color: "var(--color-text-muted)" }}
          >
            ← All comics
          </Link>
          <h1 className="type-h1 uppercase" style={{ color: "var(--color-dark)" }}>
            {comic.title || "(untitled)"}
          </h1>
        </div>
        <Link
          href={`/comics/${comic.slug}`}
          className="font-barlow-condensed font-bold uppercase no-underline"
          style={{
            padding: "10px 16px",
            background: "var(--color-dark)",
            color: "white",
            fontSize: 12,
            letterSpacing: "0.06em",
          }}
        >
          Preview
        </Link>
      </div>

      <EditMetaForm
        id={comic.id}
        slug={comic.slug}
        title={comic.title}
        subtitle={comic.subtitle}
        episode={comic.episode}
        published={comic.published}
      />

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
        <CoverUploadForm
          id={comic.id}
          kind="thumbnail"
          label="Card thumbnail"
          helper="Shown on /updates and search results."
          currentSrc={comic.image}
        />
        <CoverUploadForm
          id={comic.id}
          kind="grid"
          label="Cover / grid image"
          helper="Shown on the viewer splash screen."
          currentSrc={comic.gridImage}
        />
      </div>

      <div className="flex flex-col" style={{ gap: 16 }}>
        <div className="flex items-baseline justify-between" style={{ gap: 12 }}>
          <h2
            className="font-barlow-condensed font-bold uppercase"
            style={{ fontSize: 20, color: "var(--color-dark)", letterSpacing: "0.02em" }}
          >
            Panels
          </h2>
          <span className="type-caption" style={{ color: "var(--color-text-muted)" }}>
            {comic.panels.length} total
          </span>
        </div>

        <AddPanelsForm comicId={comic.id} />

        {comic.panels.length === 0 ? (
          <p className="type-body-sm" style={{ color: "var(--color-text-muted)" }}>
            No panels yet — upload the first one above.
          </p>
        ) : (
          <div className="flex flex-col" style={{ gap: 8 }}>
            {comic.panels.map((p, i) => (
              <div
                key={p.id}
                className="flex items-start"
                style={{
                  gap: 16,
                  padding: 12,
                  border: "1px solid var(--color-border-light)",
                  background: "white",
                }}
              >
                <div
                  className="relative shrink-0"
                  style={{ width: 96, height: 120, background: "var(--color-light-bg)", overflow: "hidden" }}
                >
                  <Image src={p.src} alt="" fill sizes="96px" style={{ objectFit: "cover" }} />
                </div>

                <form action={updatePanelCaption} className="flex-1 flex flex-col" style={{ gap: 6 }}>
                  <input type="hidden" name="panelId" value={p.id} />
                  <input type="hidden" name="slug" value={comic.slug} />
                  <span
                    className="type-caption"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Panel {i + 1} of {comic.panels.length}
                  </span>
                  <textarea
                    name="caption"
                    defaultValue={p.caption ?? ""}
                    placeholder="Optional caption…"
                    rows={2}
                    className="font-barlow-body"
                    style={{
                      padding: "8px 10px",
                      border: "1px solid var(--color-border-light)",
                      fontSize: 15,
                      color: "var(--color-dark)",
                      resize: "vertical",
                    }}
                  />
                  <button
                    type="submit"
                    className="self-start font-barlow-condensed font-bold uppercase cursor-pointer border-none"
                    style={{
                      padding: "6px 12px",
                      background: "var(--color-yellow)",
                      color: "var(--color-dark)",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Save caption
                  </button>
                </form>

                <div className="flex flex-col shrink-0" style={{ gap: 6 }}>
                  <form action={movePanelAction}>
                    <input type="hidden" name="comicId" value={comic.id} />
                    <input type="hidden" name="panelId" value={p.id} />
                    <input type="hidden" name="slug" value={comic.slug} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={i === 0}
                      className="font-barlow-condensed cursor-pointer border disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        padding: "6px 12px",
                        background: "white",
                        color: "var(--color-dark)",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        borderColor: "var(--color-border-light)",
                      }}
                    >
                      ↑ up
                    </button>
                  </form>
                  <form action={movePanelAction}>
                    <input type="hidden" name="comicId" value={comic.id} />
                    <input type="hidden" name="panelId" value={p.id} />
                    <input type="hidden" name="slug" value={comic.slug} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={i === comic.panels.length - 1}
                      className="font-barlow-condensed cursor-pointer border disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        padding: "6px 12px",
                        background: "white",
                        color: "var(--color-dark)",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        borderColor: "var(--color-border-light)",
                      }}
                    >
                      ↓ down
                    </button>
                  </form>
                  <form action={deletePanelAction}>
                    <input type="hidden" name="panelId" value={p.id} />
                    <input type="hidden" name="slug" value={comic.slug} />
                    <button
                      type="submit"
                      className="font-barlow-condensed cursor-pointer border"
                      style={{
                        padding: "6px 12px",
                        background: "white",
                        color: "var(--color-red)",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        borderColor: "var(--color-border-light)",
                      }}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
