import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import type { ParsedResume } from "./types";

function heading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel]) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 240, after: 120 },
  });
}

function body(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    spacing: { after: 80 },
  });
}

function bullet(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });
}

export function buildDocxFromStructured(parsed: ParsedResume): Document {
  const contact = [parsed.email, parsed.phone, parsed.linkedin, parsed.location]
    .filter(Boolean)
    .join("  •  ");

  const children: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: parsed.name, bold: true, size: 32 })],
      alignment: AlignmentType.CENTER,
    }),
  ];

  if (contact) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contact, size: 20, color: "555555" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" } },
      })
    );
  }

  if (parsed.summary) {
    children.push(heading("Professional Summary", HeadingLevel.HEADING_2));
    children.push(body(parsed.summary));
  }

  if (parsed.experience.length > 0) {
    children.push(heading("Experience", HeadingLevel.HEADING_2));
    for (const exp of parsed.experience) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.title, bold: true, size: 24 }),
            new TextRun({ text: `  |  ${exp.company}`, size: 22 }),
          ],
          spacing: { before: 120 },
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: exp.dates, italics: true, size: 20, color: "666666" })],
          spacing: { after: 80 },
        })
      );
      for (const b of exp.bullets) {
        children.push(bullet(b));
      }
    }
  }

  if (parsed.education.length > 0) {
    children.push(heading("Education", HeadingLevel.HEADING_2));
    for (const edu of parsed.education) {
      children.push(body(`${edu.degree} — ${edu.institution}${edu.year ? ` (${edu.year})` : ""}`));
    }
  }

  const skills = [...parsed.skills.technical, ...parsed.skills.soft];
  if (skills.length > 0) {
    children.push(heading("Skills", HeadingLevel.HEADING_2));
    children.push(body(skills.join(", ")));
  }

  if (parsed.certifications?.length) {
    children.push(heading("Certifications", HeadingLevel.HEADING_2));
    for (const cert of parsed.certifications) {
      children.push(bullet(cert));
    }
  }

  return new Document({
    sections: [{ properties: {}, children }],
  });
}

export function buildDocxFromText(text: string): Document {
  const lines = text.split("\n");
  const children = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return new Paragraph({ text: "" });
    if (/^[A-Z\s&]{3,40}$/.test(trimmed) && trimmed.length < 45) {
      return heading(trimmed, HeadingLevel.HEADING_2);
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      return bullet(trimmed.replace(/^[-•]\s*/, ""));
    }
    return body(trimmed);
  });

  return new Document({ sections: [{ properties: {}, children }] });
}

export async function generateDocxBuffer(parsed?: ParsedResume, plainText?: string): Promise<Buffer> {
  const doc = parsed ? buildDocxFromStructured(parsed) : buildDocxFromText(plainText ?? "");
  return Packer.toBuffer(doc);
}
