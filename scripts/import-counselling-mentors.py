#!/usr/bin/env python3
"""Import councelling team sheet → public JSON + private contacts JSON."""
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

KEYWORDS = [
    (["medical", "doctor", "mbbs", "pgt", "biology", "zoology", "nursing", "pharm"], "Medicine"),
    (["navy", "merchant", "marine", "aviation", "air force", "pilot", "airline", "ame", "cabin"], "Aviation & aerospace"),
    (["upsc", "ias", "civil service", "public admin"], "Civil Services (UPSC)"),
    (["law", "advocate", "judicial", "clat", "llb"], "Law & judiciary"),
    (["defence", "nda", "cds", "afcat", "army", "ssb", "military"], "Defence (NDA/CDS/AFCAT)"),
    (["police", "capf", "crpf"], "Police & CAPF"),
    (["bank", "ssc", "ibps", "insurance"], "Banking & SSC"),
    (["railway", "rrb", "loco"], "Railways & RRB"),
    (["teacher", "teaching", "pgt", "tgt", "ctet", "tet", "kvs", "principal", "lecturer"], "Teaching (CTET / TET)"),
    (["software", "developer", "architect", "computer", "it ", "data", "ai"], "Computer science & IT"),
    (["engineer", "engineering", "gate", "be ", "b.tech", "production"], "Engineering (core branches)"),
    (["mba", "management", "finance", "commerce", "ca ", "cs ", "cma"], "Management & MBA"),
    (["hotel", "hospitality", "ihm", "culinary"], "Hotel management"),
    (["agriculture", "farmer", "rural"], "Agriculture & rural development"),
]

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"


def infer_field(text: str) -> str:
    t = text.lower()
    for keys, field in KEYWORDS:
        if any(k in t for k in keys):
            return field
    return "General mentorship & careers"


def clean(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip())


def cell_ref_to_col(ref: str) -> int:
    col = "".join(c for c in ref if c.isalpha())
    n = 0
    for ch in col:
        n = n * 26 + (ord(ch.upper()) - ord("A") + 1)
    return n - 1


def main() -> None:
    xlsx_path = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(xlsx_path) as z:
        ss: list[str] = []
        root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in root.findall(f".//{NS}si"):
            texts = []
            for t in si.iter(f"{NS}t"):
                if t.text:
                    texts.append(t.text)
            ss.append("".join(texts))

        wb = ET.fromstring(z.read("xl/workbook.xml"))
        rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        rid_to_target = {
            rel.get("Id"): "xl/" + rel.get("Target").lstrip("/") for rel in rels
        }
        rid = None
        for s in wb.findall(f".//{NS}sheet"):
            if s.attrib.get("name", "").lower() == "councelling team":
                rid = s.attrib.get(
                    "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
                )
        if not rid:
            raise SystemExit("Sheet 'councelling team' not found")

        sheet = ET.fromstring(z.read(rid_to_target[rid]))
        rows_dict: dict[int, dict[int, str]] = {}
        for row in sheet.findall(f".//{NS}row"):
            rnum = int(row.get("r"))
            rows_dict[rnum] = {}
            for c in row.findall(f"{NS}c"):
                col = cell_ref_to_col(c.get("r"))
                v = c.find(f"{NS}v")
                val = ""
                if v is not None and v.text is not None:
                    val = ss[int(v.text)] if c.get("t") == "s" else v.text
                rows_dict[rnum][col] = val

        max_row = max(rows_dict)
        max_col = max(max(cols) for cols in rows_dict.values())
        table = [
            [clean(rows_dict.get(r, {}).get(c, "")) for c in range(max_col + 1)]
            for r in range(1, max_row + 1)
        ]

    header = table[0]
    idx = {h: i for i, h in enumerate(header)}
    public = []
    contacts = {}
    for i, row in enumerate(table[1:], start=1):
        name = clean(row[idx["Name"]])
        if not name:
            continue
        mid = f"cm{i:02d}"
        passout = clean(row[idx["Passout Year"]])
        admission = clean(row[idx["Admission Year"]])
        prof = clean(row[idx["Profession Details"]]) or clean(row[idx["Profession"]])
        edu_area = clean(row[idx["Education Details (Area of Study)"]])
        edu_uni = clean(row[idx["Education Details (College/University)"]])
        native = clean(row[idx["Native Place"]])
        org = clean(row[idx["Current Organization"]])
        blob = f"{prof} {edu_area} {edu_uni} {org}"
        field = infer_field(blob)
        bio_parts = [
            p
            for p in [
                prof,
                f"Education: {edu_uni}" if edu_uni else None,
                f"Specialisation: {edu_area}" if edu_area else None,
            ]
            if p
        ]
        bio = (
            ". ".join(bio_parts) + "."
            if bio_parts
            else "NVRAA counselling team volunteer."
        )
        topics = [t for t in [prof[:80] if prof else None, edu_area[:60] if edu_area else None] if t]
        email = clean(row[idx["Email"]])
        mobile = clean(row[idx["Mobile No"]])
        wa = clean(row[idx["Whatsapp No"]])
        if email.upper() == "NA":
            email = ""
        public.append(
            {
                "id": mid,
                "name": name,
                "batch": passout or admission,
                "admissionYear": admission,
                "field": field,
                "domain": clean(row[idx["Profession"]]) or "Alumni mentor",
                "location": native or "India",
                "languages": ["Hindi", "English"],
                "availability": "Introduced by NVRAA coordinator after request approval",
                "bio": bio,
                "topics": topics[:3] or ["Career guidance"],
                "organization": org,
            }
        )
        contacts[mid] = {"email": email, "mobile": mobile, "whatsapp": wa or mobile}

    (out_dir / "counselling-mentors.json").write_text(
        json.dumps({"mentors": public}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (out_dir / "mentor-contacts.private.json").write_text(
        json.dumps(contacts, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Imported {len(public)} counselling mentors.")


if __name__ == "__main__":
    main()
