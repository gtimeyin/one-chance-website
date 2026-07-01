import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getComicById, isCurrentUserCreator } from "@/lib/comics-data";
import EditMetaForm from "./EditMetaForm";
import CoverUploadForm from "./CoverUploadForm";
import AddPanelsForm from "./AddPanelsForm";
import PanelList from "./PanelList";

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
          <>
            <p className="type-caption" style={{ color: "var(--color-text-muted)" }}>
              Drag the handle to reorder panels, or use the up / down buttons.
            </p>
            <PanelList
              comicId={comic.id}
              slug={comic.slug}
              panels={comic.panels.map((p) => ({
                id: p.id,
                src: p.src,
                caption: p.caption,
              }))}
            />
          </>
        )}
      </div>
    </div>
  );
}
