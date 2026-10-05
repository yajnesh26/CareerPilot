from dataclasses import dataclass
import re

import pymupdf


@dataclass
class DocumentChunk:
    text: str
    source: str
    page: int
    chunk_index: int
    section: str


SECTION_HEADINGS = {
    "objective",
    "projects",
    "education",
    "technical skills",
    "achievements",
    "certifications",
    "experience",
    "skills",
    "summary",
    "profile",
}


def extract_pdf_pages(file_path: str) -> list[dict]:
    """
    Extract text from a PDF while preserving page information.
    """

    document = pymupdf.open(file_path)

    pages = []

    try:
        for page_number, page in enumerate(document, start=1):
            text = page.get_text("text").strip()

            if text:
                pages.append(
                    {
                        "page": page_number,
                        "text": text,
                    }
                )
    finally:
        document.close()

    return pages


def clean_text(text: str) -> str:
    """
    Perform conservative text cleanup.

    We intentionally do not rewrite or summarize the source text.
    """

    lines = []

    for line in text.splitlines():
        line = line.strip()

        if line:
            lines.append(line)

    return "\n".join(lines)


def is_section_heading(line: str) -> bool:
    """
    Identify common resume section headings.
    """

    normalized = line.strip().lower()

    return normalized in SECTION_HEADINGS


def split_into_sections(text: str) -> list[tuple[str, str]]:
    """
    Split document text into logical resume sections.

    Returns:
        List of (section_name, section_text)
    """

    lines = clean_text(text).splitlines()

    sections = []
    current_section = "General"
    current_lines = []

    for line in lines:
        if is_section_heading(line):
            if current_lines:
                sections.append(
                    (
                        current_section,
                        "\n".join(current_lines).strip(),
                    )
                )

            current_section = line.strip()
            current_lines = []
        else:
            current_lines.append(line)

    if current_lines:
        sections.append(
            (
                current_section,
                "\n".join(current_lines).strip(),
            )
        )

    return [
        (section, content)
        for section, content in sections
        if content
    ]


def split_large_text(
    text: str,
    max_chars: int = 1200,
) -> list[str]:
    """
    Split large text without cutting lines in the middle.

    We prefer line boundaries over arbitrary character boundaries.
    """

    lines = text.splitlines()

    chunks = []
    current_lines = []
    current_length = 0

    for line in lines:
        line_length = len(line)

        if (
            current_lines
            and current_length + line_length + 1 > max_chars
        ):
            chunks.append("\n".join(current_lines).strip())

            current_lines = []
            current_length = 0

        current_lines.append(line)
        current_length += line_length + 1

    if current_lines:
        chunks.append("\n".join(current_lines).strip())

    return [chunk for chunk in chunks if chunk]

def split_project_entries(text: str) -> list[tuple[str, str]]:
    """
    Split a resume Projects section into individual project entries.

    Project titles in the current resume are represented by lines
    beginning with '•'. Project descriptions use '–'.
    """

    lines = text.splitlines()

    projects = []
    current_title = None
    current_lines = []

    for line in lines:
        stripped = line.strip()

        if stripped.startswith("• "):
            if current_title is not None:
                projects.append(
                    (
                        current_title,
                        "\n".join(current_lines).strip(),
                    )
                )

            current_title = stripped[2:].strip()
            current_lines = []

        else:
            current_lines.append(stripped)

    if current_title is not None:
        projects.append(
            (
                current_title,
                "\n".join(current_lines).strip(),
            )
        )

    return [
        (title, content)
        for title, content in projects
        if title and content
    ]

def chunk_page(
    text: str,
    page_number: int,
    source: str,
    max_chars: int = 1200,
) -> list[DocumentChunk]:
    """
    Convert a page into section-aware chunks.

    The Projects section receives additional splitting so that
    each project becomes its own retrieval unit.
    """

    sections = split_into_sections(text)

    chunks = []

    for section_name, section_text in sections:

        if section_name.lower() == "projects":
            project_entries = split_project_entries(section_text)

            for project_title, project_text in project_entries:
                project_content = f"{project_title}\n{project_text}"

                project_chunks = split_large_text(
                    project_content,
                    max_chars=max_chars,
                )

                for project_chunk in project_chunks:
                    chunks.append(
                        DocumentChunk(
                            text=project_chunk,
                            source=source,
                            page=page_number,
                            chunk_index=len(chunks),
                            section=f"Projects - {project_title}",
                        )
                    )

        else:
            section_chunks = split_large_text(
                section_text,
                max_chars=max_chars,
            )

            for section_chunk in section_chunks:
                chunks.append(
                    DocumentChunk(
                        text=section_chunk,
                        source=source,
                        page=page_number,
                        chunk_index=len(chunks),
                        section=section_name,
                    )
                )

    return chunks


def ingest_pdf(
    file_path: str,
    source: str,
    max_chars: int = 1200,
) -> list[DocumentChunk]:
    """
    Extract a PDF and convert it into traceable,
    section-aware chunks.
    """

    pages = extract_pdf_pages(file_path)

    all_chunks = []

    for page in pages:
        chunks = chunk_page(
            text=page["text"],
            page_number=page["page"],
            source=source,
            max_chars=max_chars,
        )

        for chunk in chunks:
            if chunk.section.lower() == "general":
                continue
            
            chunk.chunk_index = len(all_chunks)
            all_chunks.append(chunk)

    return all_chunks