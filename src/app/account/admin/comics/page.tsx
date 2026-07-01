import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { isCurrentUserCreator, listComics } from "@/lib/comics-data";
import { deleteComic } from "@/app/actions/comics";
import NewComicForm from "./NewComicForm";

export const metadata = {
  title: "Comics Admin",
  robots: { index: false, follow: false },
};

export default async function ComicsAdminPage() {
  if (!(await isCurrentUserCreator())) {
    redirect("/account");
  }

  const comics = await listComics({ includeUnpublished: true });

  return (
    <div className="flex flex-col" style={{ gap: 32 }}>
      <div className="flex items-baseline justify-between" style={{ gap: 16 }}>
        <h1 className="type-h1 uppercase" style={{ color: "var(--color-dark)" }}>
          Comics
        </h1>
        <span
          className="type-caption"
          style={{ color: "var(--color-text-muted)" }}
        >
          {comics.length} total
        </span>
      </div>

      <NewComicForm />

      <div className="flex flex-col" style={{ gap: 12 }}>
        {comics.length === 0 ? (
          <p className="type-body-lg" style={{ color: "var(--color-text-muted)" }}>
            No comics yet — create your first one above.
          </p>
        ) : (
          comics.map((c) => (
            <div
              key={c.id}
              className="flex items-center"
              style={{
                gap: 16,
                padding: 12,
                border: "1px solid var(--color-border-light)",
                background: c.published ? "white" : "var(--color-light-bg)",
              }}
            >
              <div
                className="relative shrink-0"
                style={{
                  width: 72,
                  height: 72,
                  background: "var(--color-light-bg)",
                  overflow: "hidden",
                }}
              >
                {(c.image || c.gridImage) && (
                  <Image
                    src={c.image || c.gridImage}
                    alt=""
                    fill
                    sizes="72px"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 2 }}>
                <span
                  className="font-barlow-condensed font-bold uppercase truncate"
                  style={{ fontSize: 18, color: "var(--color-dark)" }}
                >
                  {c.title || "(untitled)"}
                </span>
                <span
                  className="type-body-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {c.episode || "no episode"} · {c.panels.length} panel
                  {c.panels.length === 1 ? "" : "s"}
                  {!c.published && " · draft"}
                </span>
                <span
                  className="type-caption"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  /comics/{c.slug}
                </span>
              </div>
              <Link
                href={`/account/admin/comics/${c.id}`}
                className="font-barlow-condensed font-bold uppercase no-underline"
                style={{
                  padding: "10px 16px",
                  background: "var(--color-yellow)",
                  color: "var(--color-dark)",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                }}
              >
                Edit
              </Link>
              <form action={deleteComic}>
                <input type="hidden" name="id" value={c.id} />
                <button
                  type="submit"
                  className="font-barlow-condensed font-bold uppercase cursor-pointer border-none"
                  style={{
                    padding: "10px 12px",
                    background: "transparent",
                    color: "var(--color-red)",
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    border: "1px solid var(--color-border-light)",
                  }}
                  formAction={deleteComic}
                >
                  Delete
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
