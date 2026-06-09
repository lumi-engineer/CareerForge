export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  const lowerName = fileName.toLowerCase();

  if (
    mimeType === "application/pdf" ||
    lowerName.endsWith(".pdf")
  ) {
    const pdfParse = (await import("pdf-parse")).default;
    const pdfData = await pdfParse(buffer);
    return pdfData.text?.trim() ?? "";
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword" ||
    lowerName.endsWith(".docx") ||
    lowerName.endsWith(".doc")
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value?.trim() ?? "";
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
}

export function isSupportedResumeFile(mimeType: string, fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return (
    mimeType === "application/pdf" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword" ||
    lower.endsWith(".pdf") ||
    lower.endsWith(".docx") ||
    lower.endsWith(".doc")
  );
}
