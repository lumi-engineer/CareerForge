import type { ParsedResume } from "./types";

export async function downloadDocx(options: {
  text?: string;
  structuredResume?: ParsedResume;
  fileName?: string;
}): Promise<void> {
  const response = await fetch("/api/export-docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to export DOCX.");
  }

  const blob = await response.blob();
  const safeName = (options.fileName ?? "Resume").replace(/[^\w\s-]/g, "").trim() || "Resume";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
