// Bordered data-plane container with a left accent bar and optional
// background texture — the app's alternative to a generic "card".
export default function Panel({
  children,
  accent = "accent-600",
  texture = "none", // none | grid | grid-animated | dots
  tone = "white", // white | slate
  className = "",
}) {
  const textureClass =
    texture === "grid"
      ? "bg-grid"
      : texture === "grid-animated"
        ? "bg-grid bg-grid-animated"
        : texture === "dots"
          ? "bg-dots"
          : "";
  const toneClass = tone === "slate" ? "bg-slate-50" : "bg-white";
  return (
    <div
      className={`relative border border-slate-200 ${toneClass} ${textureClass} shadow-sm ${className}`}
      style={{ borderLeftWidth: "3px", borderLeftColor: `var(--color-${accent})` }}
    >
      {children}
    </div>
  );
}
