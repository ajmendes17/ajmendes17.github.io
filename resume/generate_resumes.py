#!/usr/bin/env python3
"""Generate three one-column resume variants for AJ Mendes."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"


@dataclass(frozen=True)
class Theme:
    name: str
    accent: colors.Color
    heading_font: str
    body_font: str
    name_size: float
    body_size: float
    margin: float
    centered_header: bool = False
    section_rule: bool = True


INDUSTRIAL = Theme(
    name="industrial-software",
    accent=colors.HexColor("#0B4A6F"),
    heading_font="Helvetica-Bold",
    body_font="Helvetica",
    name_size=22,
    body_size=9.05,
    margin=0.64 * inch,
)

SOFTWARE = Theme(
    name="software-engineering",
    accent=colors.HexColor("#17324D"),
    heading_font="Helvetica-Bold",
    body_font="Helvetica",
    name_size=23,
    body_size=8.95,
    margin=0.62 * inch,
    centered_header=True,
)

DATA = Theme(
    name="data-cyber",
    accent=colors.HexColor("#285943"),
    heading_font="Times-Bold",
    body_font="Times-Roman",
    name_size=23,
    body_size=9.15,
    margin=0.65 * inch,
)


CONTACT = (
    '<link href="mailto:ajmendes17@gmail.com" color="#20252A">ajmendes17@gmail.com</link>'
    '  |  (720) 442-4724  |  Golden, CO  |  '
    '<link href="https://ajmendes17.github.io" color="#20252A">ajmendes17.github.io</link>  |  '
    '<link href="https://www.linkedin.com/in/aj-mendes-b49709341" color="#20252A">LinkedIn</link>'
)

DATA_CONTACT = (
    '<b>Email:</b> <link href="mailto:ajmendes17@gmail.com" color="#20252A">'
    "ajmendes17@gmail.com</link><br/>"
    "<b>Phone:</b> (720) 442-4724 | Golden, CO<br/>"
    '<b>Portfolio:</b> <link href="https://ajmendes17.github.io" color="#20252A">'
    "ajmendes17.github.io</link><br/>"
    '<b>LinkedIn:</b> <link href="https://www.linkedin.com/in/aj-mendes-b49709341" '
    'color="#20252A">linkedin.com/in/aj-mendes-b49709341</link>'
)


EDUCATION = (
    "Colorado School of Mines",
    "B.S. Computer Science | Minor in Military Science | Pursuing Cyber Defense Certificate",
    "Expected May 2027 | GPA: 3.5",
)


DATA_MINE_BULLETS = [
    "Built Python evaluation tools for K-means clustering on labeled synthetic cybersecurity data, reporting accuracy, adjusted Rand index, and normalized mutual information across controlled experiments.",
    "Tested robustness across noise, cluster-count, and feature-variation sweeps; observed approximately 98% cluster-assignment accuracy in labeled tests with up to 20 clusters.",
    "Developed centroid-matching and drift-visualization workflows using PCA, UMAP, and t-SNE; documented and presented findings with Purdue, Data Mine of the Rockies, and CrowdStrike collaborators.",
]

XPECT_BULLETS = [
    "Assembled and wired industrial electrical control panels from schematics, wiring diagrams, and technical drawings.",
    "Routed, bundled, terminated, and labeled conductors to NEC and company standards while performing detail-focused quality checks across concurrent builds.",
]

FORMIT_BULLETS = [
    "Completed five summers of full-time concrete, site-preparation, material-handling, and landscaping work in changing jobsite conditions and early-shift schedules.",
]

SECURE_CHAT_BULLETS = [
    "Built a Python TCP client-server chat application using RSA-2048/OAEP key exchange and AES-256-GCM authenticated encryption; the relay forwards ciphertext without access to plaintext.",
    "Implemented persistent keys, a framed message protocol, Tkinter UI, tamper detection, and component test scripts for crypto, protocol, client, and server behavior.",
]

MARKETPULSE_BULLETS = [
    "Built a Python ML research pipeline that engineers returns, volatility, moving-average, volume, RSI, and MACD features for seven equities against SPY.",
    "Compared logistic regression, random forest, and dense neural-network models with time-aware backtests, transaction costs, threshold sweeps, automated reports, tests, and a Streamlit dashboard.",
]

CLUE_BULLETS = [
    "Developed a Java Swing implementation of Clue with configuration-driven board loading, graph-based movement, card and rule state, and computer-player decisions.",
    "Validated game behavior with 80 JUnit 5 tests covering adjacency, targets, dealing, suggestions, accusations, and exception paths.",
]

CALL_FOR_FIRE_BULLETS = [
    "Created a browser-only React and TypeScript training application with structured command parsing, scenario generation, guided correction loops, scoring, and saved session history.",
]

HANDSHAKE_BULLETS = [
    "Create and source-verify complex research tasks used to evaluate advanced AI systems; analyze model responses for factual accuracy, research quality, and failure patterns.",
]


def styles_for(theme: Theme) -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    header_alignment = TA_CENTER if theme.centered_header else TA_LEFT
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName=theme.heading_font,
            fontSize=theme.name_size,
            leading=theme.name_size + 1,
            textColor=theme.accent,
            alignment=header_alignment,
            spaceAfter=1,
        ),
        "tagline": ParagraphStyle(
            "Tagline",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=10.5,
            tracking=0.8,
            textColor=colors.HexColor("#3F4850"),
            alignment=header_alignment,
            spaceAfter=2,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.05,
            leading=9.8,
            textColor=colors.HexColor("#20252A"),
            alignment=header_alignment,
            spaceAfter=3,
        ),
        "contact_vertical": ParagraphStyle(
            "ContactVertical",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=7.85,
            leading=9.2,
            textColor=colors.HexColor("#20252A"),
            alignment=header_alignment,
            spaceAfter=2,
        ),
        "summary": ParagraphStyle(
            "Summary",
            parent=base["Normal"],
            fontName=theme.body_font,
            fontSize=theme.body_size,
            leading=theme.body_size + 2.4,
            textColor=colors.HexColor("#20252A"),
            spaceAfter=1,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName=theme.heading_font,
            fontSize=10.1,
            leading=11.8,
            textColor=theme.accent,
            spaceBefore=6.5,
            spaceAfter=2.6,
        ),
        "entry": ParagraphStyle(
            "Entry",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.35,
            leading=11.1,
            textColor=colors.HexColor("#111418"),
            spaceBefore=2.8,
            spaceAfter=0.2,
        ),
        "meta": ParagraphStyle(
            "Meta",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8.25,
            leading=9.9,
            textColor=colors.HexColor("#48515A"),
            spaceAfter=0.6,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName=theme.body_font,
            fontSize=theme.body_size,
            leading=theme.body_size + 2.2,
            leftIndent=11,
            firstLineIndent=-8,
            bulletIndent=0,
            textColor=colors.HexColor("#20252A"),
            spaceAfter=1.15,
        ),
        "skills": ParagraphStyle(
            "Skills",
            parent=base["Normal"],
            fontName=theme.body_font,
            fontSize=theme.body_size,
            leading=theme.body_size + 2.5,
            textColor=colors.HexColor("#20252A"),
            spaceAfter=0.5,
        ),
    }


def draw_page(canvas, doc, theme: Theme, label: str) -> None:
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(theme.accent)
    canvas.rect(0, height - 0.18 * inch, width, 0.18 * inch, fill=1, stroke=0)
    canvas.restoreState()


def build_doc(path: Path, theme: Theme, label: str, story: list) -> None:
    doc = BaseDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=theme.margin,
        rightMargin=theme.margin,
        topMargin=0.34 * inch,
        bottomMargin=0.42 * inch,
        title=f"AJ Mendes Resume - {label}",
        author="AJ Mendes",
        subject="Computer science internship resume",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates(
        [PageTemplate(id="resume", frames=[frame], onPage=lambda c, d: draw_page(c, d, theme, label))]
    )
    doc.build(story)


def header(story: list, s: dict, tagline: str, contact: str = CONTACT, vertical: bool = False) -> None:
    story.extend(
        [
            Spacer(1, 4),
            Paragraph("AJ MENDES", s["name"]),
            Paragraph(tagline.upper(), s["tagline"]),
            Paragraph(contact, s["contact_vertical"] if vertical else s["contact"]),
        ]
    )


def section(story: list, s: dict, theme: Theme, title: str) -> None:
    story.append(Paragraph(title.upper(), s["section"]))
    if theme.section_rule:
        story.append(HRFlowable(width="100%", thickness=0.55, color=theme.accent, spaceAfter=1.8))


def entry(story: list, s: dict, title: str, meta: str, bullets: Iterable[str]) -> None:
    story.append(Paragraph(title, s["entry"]))
    story.append(Paragraph(meta, s["meta"]))
    for item in bullets:
        story.append(Paragraph(item, s["bullet"], bulletText="-"))


def education(story: list, s: dict) -> None:
    school, degree, details = EDUCATION
    entry(story, s, school, f"{degree} | {details}", [])


def skills(story: list, s: dict, rows: list[tuple[str, str]]) -> None:
    for label, value in rows:
        story.append(Paragraph(f"<b>{label}:</b> {value}", s["skills"]))


def industrial_story(theme: Theme) -> list:
    s = styles_for(theme)
    story: list = []
    header(story, s, "Industrial software | data systems | secure engineering")
    section(story, s, theme, "Profile")
    story.append(
        Paragraph(
            "Colorado School of Mines computer science student combining software, cybersecurity data research, and hands-on industrial systems experience. Builds testable Python and Java tools, works comfortably from technical documentation, and communicates results across engineering teams.",
            s["summary"],
        )
    )
    section(story, s, theme, "Education")
    education(story, s)
    section(story, s, theme, "Experience")
    entry(story, s, "Undergraduate Data Science Researcher", "The Data Mine, Purdue University | Jan 2026 - May 2026", DATA_MINE_BULLETS)
    entry(story, s, "Electrical Control Panel Technician", "Xpect Solutions, Longmont, CO | Jun 2025 - Aug 2025", XPECT_BULLETS)
    entry(story, s, "Construction and General Labor", "Formit Right Concrete, Longmont, CO | Summers 2020 - 2024", FORMIT_BULLETS)
    section(story, s, theme, "Selected Technical Work")
    entry(story, s, "Secure Chat Application", "Python | TCP sockets | RSA-OAEP | AES-GCM", SECURE_CHAT_BULLETS[:1])
    entry(story, s, "MarketPulse AI", "Python | scikit-learn | TensorFlow/Keras | Streamlit", MARKETPULSE_BULLETS[:1])
    section(story, s, theme, "Skills and Leadership")
    skills(
        story,
        s,
        [
            ("Languages", "Python, Java, C++, SQL, R, TypeScript/JavaScript, HTML/CSS"),
            ("Tools", "Git, Linux, pandas, NumPy, scikit-learn, JUnit 5, React, Streamlit"),
            ("Additional", "Army ROTC, Mines ORESEC/CCDC, Secret security clearance"),
        ],
    )
    return story


def software_story(theme: Theme) -> list:
    s = styles_for(theme)
    story: list = []
    header(story, s, "Software engineering | secure systems | testing")
    section(story, s, theme, "Profile")
    story.append(
        Paragraph(
            "Computer science student building secure, testable applications across Python, Java, and TypeScript. Comfortable owning protocol design, application state, user interfaces, automated tests, and the documentation needed to explain engineering decisions.",
            s["summary"],
        )
    )
    section(story, s, theme, "Education")
    education(story, s)
    section(story, s, theme, "Selected Projects")
    entry(story, s, "Secure Chat Application", "Python | TCP sockets | cryptography | Tkinter", SECURE_CHAT_BULLETS)
    entry(story, s, "ClueGame", "Java | Swing | JUnit 5 | object-oriented design", CLUE_BULLETS)
    entry(story, s, "Call for Fire Trainer", "React | TypeScript | Vite | browser APIs", CALL_FOR_FIRE_BULLETS)
    section(story, s, theme, "Technical Experience")
    entry(story, s, "Undergraduate Data Science Researcher", "The Data Mine, Purdue University | Jan 2026 - May 2026", [DATA_MINE_BULLETS[0], DATA_MINE_BULLETS[2]])
    entry(story, s, "Electrical Control Panel Technician", "Xpect Solutions, Longmont, CO | Jun 2025 - Aug 2025", XPECT_BULLETS)
    entry(story, s, "Construction and General Labor", "Formit Right Concrete, Longmont, CO | Summers 2020 - 2024", FORMIT_BULLETS)
    section(story, s, theme, "Skills and Leadership")
    skills(
        story,
        s,
        [
            ("Languages", "Python, Java, C++, SQL, R, TypeScript/JavaScript, HTML/CSS"),
            ("Engineering", "OOP, data structures, TCP protocols, cryptography, testing, Git, Linux"),
            ("Leadership", "Army ROTC, Mines ORESEC/CCDC, Secret security clearance"),
        ],
    )
    return story


def data_story(theme: Theme) -> list:
    s = styles_for(theme)
    story: list = []
    header(
        story,
        s,
        "Data science | machine learning | cybersecurity analytics",
        contact=DATA_CONTACT,
        vertical=True,
    )
    section(story, s, theme, "Profile")
    story.append(
        Paragraph(
            "Computer science student focused on reproducible data analysis, machine-learning evaluation, and secure systems. Experience designing controlled clustering experiments, building time-aware model pipelines, visualizing results, and translating technical findings for collaborators.",
            s["summary"],
        )
    )
    section(story, s, theme, "Education")
    education(story, s)
    section(story, s, theme, "Research Experience")
    entry(story, s, "Undergraduate Data Science Researcher", "The Data Mine, Purdue University | CrowdStrike project | Jan 2026 - May 2026", DATA_MINE_BULLETS)
    section(story, s, theme, "Projects")
    entry(story, s, "MarketPulse AI", "Python | pandas | scikit-learn | TensorFlow/Keras | Streamlit", MARKETPULSE_BULLETS)
    entry(story, s, "Secure Chat Application", "Python | RSA-OAEP | AES-256-GCM | TCP", SECURE_CHAT_BULLETS[:1])
    section(story, s, theme, "Additional Experience")
    entry(story, s, "AI Research Contributor", "Handshake AI | 2026 - Present", HANDSHAKE_BULLETS)
    entry(story, s, "Electrical Control Panel Technician", "Xpect Solutions, Longmont, CO | Jun 2025 - Aug 2025", XPECT_BULLETS[:1])
    entry(story, s, "Construction and General Labor", "Formit Right Concrete, Longmont, CO | Summers 2020 - 2024", FORMIT_BULLETS)
    section(story, s, theme, "Technical Skills")
    skills(
        story,
        s,
        [
            ("Languages", "Python, SQL, R, Java, C++, TypeScript/JavaScript"),
            ("Data/ML", "pandas, NumPy, scikit-learn, TensorFlow/Keras, PCA, t-SNE, clustering, backtesting"),
            ("Tools", "Git, Linux, Streamlit, Matplotlib"),
        ],
    )
    section(story, s, theme, "Leadership and Credentials")
    skills(
        story,
        s,
        [
            ("Leadership", "Army ROTC Cadet, Colorado School of Mines"),
            ("Credential", "Secret security clearance"),
        ],
    )
    return story


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    variants = [
        (INDUSTRIAL, "Cyberhawk / Industrial Software", industrial_story),
        (SOFTWARE, "Software Engineering", software_story),
        (DATA, "Data / Cyber Analytics", data_story),
    ]
    for theme, label, build_story in variants:
        output = OUTPUT_DIR / f"aj-mendes-resume-{theme.name}.pdf"
        build_doc(output, theme, label, build_story(theme))
        print(output)


if __name__ == "__main__":
    main()
