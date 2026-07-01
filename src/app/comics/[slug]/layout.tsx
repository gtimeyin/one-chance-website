// Bare layout — no Navbar, no Footer. The comic viewer takes over the
// whole viewport for an immersive reading experience.
export default function ComicViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
