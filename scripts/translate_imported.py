from __future__ import annotations

import json
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import yaml
from bs4 import BeautifulSoup
from bs4.element import NavigableString
import argostranslate.translate

ROOT = Path.cwd()
IMPORTED_ROOT = ROOT / "src" / "imported"
CACHE_PATH = ROOT / ".cache" / "translation-cache-en-es.json"
BACKEND = os.environ.get("TRANSLATION_BACKEND", "google").lower()
SEGMENT = "@@@@SEG@@@@"

SKIP_PARENTS = {"script", "style", "code", "pre", "svg", "noscript"}
CONFLICTING_PERMALINKS = {}

POST_REPLACEMENTS = [
    (r"\bcaja de los pies\b", "puntera"),
    (r"\bcaja de pie\b", "puntera"),
    (r"\bcaja de dedos\b", "puntera"),
    (r"\bcaja del dedo\b", "puntera"),
    (r"\bcaja de la punta\b", "puntera"),
    (r"\bpunta ancha\b", "puntera amplia"),
    (r"\bdedos anchos\b", "puntera amplia"),
    (r"\bzapatos descalzos\b", "zapatos barefoot"),
    (r"\bzapato descalzo\b", "zapato barefoot"),
    (r"\bcalzado descalzo\b", "calzado barefoot"),
    (r"\bminimalista desnudo\b", "minimalista"),
    (r"\bsuela cero caída\b", "suela zero drop"),
    (r"\bcero caída\b", "zero drop"),
    (r"\bcaída cero\b", "zero drop"),
    (r"\bdescalzo\b", "barefoot"),
    (r"\bBarefoot\b", "Barefoot"),
    (r"\bZapatos Barefoot\b", "Zapatos barefoot"),
]

UI_REPLACEMENTS = {
    "Table Of Contents": "Tabla de contenidos",
    "Table of Contents": "Tabla de contenidos",
    "Read More": "Leer más",
    "Subscribe": "Suscribirse",
    "Leave a Comment": "Dejar un comentario",
}


def load_cache() -> dict[str, str]:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    return {}


def save_cache(cache: dict[str, str]) -> None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")


def get_translation():
    if BACKEND == "google":
        return GoogleTranslator()

    languages = argostranslate.translate.get_installed_languages()
    source = next(lang for lang in languages if lang.code == "en")
    target = next(lang for lang in languages if lang.code == "es")
    return source.get_translation(target)


class GoogleTranslator:
    def translate(self, text: str) -> str:
        query = urlencode({"client": "gtx", "sl": "en", "tl": "es", "dt": "t", "q": text})
        request = Request(
            f"https://translate.googleapis.com/translate_a/single?{query}",
            headers={"User-Agent": "Mozilla/5.0"},
        )
        for attempt in range(4):
            try:
                with urlopen(request, timeout=30) as response:
                    payload = json.loads(response.read().decode("utf-8"))
                return "".join(part[0] for part in payload[0] if part and part[0])
            except Exception:
                if attempt == 3:
                    raise
                time.sleep(1.5 * (attempt + 1))
        return text


def cleanup(text: str) -> str:
    value = text
    for pattern, replacement in POST_REPLACEMENTS:
        value = re.sub(pattern, replacement, value, flags=re.IGNORECASE)
    value = value.replace("Barefoot", "barefoot")
    value = value.replace("barefoot Opiniones", "Barefoot Opiniones")
    return value


def should_translate(text: str) -> bool:
    if not text or not text.strip():
        return False
    if not re.search(r"[A-Za-z]", text):
        return False
    if text.strip().startswith("http"):
        return False
    return True


def translate_text(text: str, translator, cache: dict[str, str]) -> str:
    if not should_translate(text):
        return text

    if text in UI_REPLACEMENTS:
        return UI_REPLACEMENTS[text]

    leading = re.match(r"^\s*", text).group(0)
    trailing = re.search(r"\s*$", text).group(0)
    core = text.strip()

    if core in UI_REPLACEMENTS:
        return f"{leading}{UI_REPLACEMENTS[core]}{trailing}"

    if core in cache:
        return f"{leading}{cache[core]}{trailing}"

    chunks = split_chunks(core)
    translated = " ".join(translator.translate(chunk) for chunk in chunks)
    translated = cleanup(translated)
    cache[core] = translated
    return f"{leading}{translated}{trailing}"


def translate_cores(cores: list[str], translator, cache: dict[str, str]) -> dict[str, str]:
    result: dict[str, str] = {}
    pending: list[str] = []

    for core in dict.fromkeys(cores):
        if core in UI_REPLACEMENTS:
            result[core] = UI_REPLACEMENTS[core]
        elif core in cache:
            result[core] = cache[core]
        else:
            pending.append(core)

    if BACKEND != "google":
        for core in pending:
            chunks = split_chunks(core)
            translated = " ".join(translator.translate(chunk) for chunk in chunks)
            result[core] = cleanup(translated)
            cache[core] = result[core]
        return result

    units: list[tuple[str, int, str]] = []
    for core in pending:
        chunks = split_chunks(core, limit=1200)
        for chunk_index, chunk in enumerate(chunks):
            units.append((core, chunk_index, chunk))

    batches: list[list[tuple[str, int, str]]] = []
    current_batch: list[tuple[str, int, str]] = []
    current_size = 0

    for unit in units:
        unit_size = len(unit[2]) + len(SEGMENT) + 4
        if current_batch and current_size + unit_size > 3600:
            batches.append(current_batch)
            current_batch = []
            current_size = 0
        current_batch.append(unit)
        current_size += unit_size
    if current_batch:
        batches.append(current_batch)

    def translate_batch(batch: list[tuple[str, int, str]]) -> list[tuple[tuple[str, int], str]]:
        text = f"\n{SEGMENT}\n".join(unit[2] for unit in batch)
        translated = translator.translate(text)
        parts = translated.split(SEGMENT)
        if len(parts) != len(batch):
            parts = [translator.translate(unit[2]) for unit in batch]
        return [
            ((unit[0], unit[1]), cleanup(translated_part.strip()))
            for unit, translated_part in zip(batch, parts)
        ]

    translated_units: dict[tuple[str, int], str] = {}
    max_workers = min(8, max(1, len(batches)))
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(translate_batch, batch) for batch in batches]
        for future in as_completed(futures):
            for key, value in future.result():
                translated_units[key] = value

    for core in pending:
        chunks = split_chunks(core, limit=1200)
        translated = " ".join(translated_units[(core, index)] for index, _ in enumerate(chunks))
        result[core] = cleanup(translated)
        cache[core] = result[core]

    return result


def split_chunks(text: str, limit: int = 900) -> list[str]:
    if len(text) <= limit:
        return [text]

    parts = re.split(r"(?<=[.!?])\s+", text)
    chunks: list[str] = []
    current = ""

    for part in parts:
        candidate = f"{current} {part}".strip()
        if len(candidate) <= limit:
            current = candidate
            continue
        if current:
            chunks.append(current)
        current = part

    if current:
        chunks.append(current)
    return chunks


def split_frontmatter(raw: str) -> tuple[dict, str]:
    if not raw.startswith("---\n"):
        return {}, raw
    _, frontmatter, content = raw.split("---", 2)
    return yaml.safe_load(frontmatter) or {}, content.lstrip("\n")


def dump_frontmatter(data: dict) -> str:
    return yaml.safe_dump(data, allow_unicode=True, sort_keys=False).strip()


def translate_html(html: str, translator, cache: dict[str, str]) -> str:
    soup = BeautifulSoup(html, "html.parser")
    entries: list[tuple[object, str, str | None, str, str, str]] = []

    for node in list(soup.find_all(string=True)):
        if not isinstance(node, NavigableString):
            continue
        if node.parent and node.parent.name in SKIP_PARENTS:
            continue
        text = str(node)
        if should_translate(text):
            leading = re.match(r"^\s*", text).group(0)
            trailing = re.search(r"\s*$", text).group(0)
            entries.append((node, "node", None, text.strip(), leading, trailing))

    for tag in soup.find_all(True):
        for attr in ("alt", "title", "aria-label"):
            if tag.has_attr(attr) and should_translate(str(tag[attr])):
                text = str(tag[attr])
                leading = re.match(r"^\s*", text).group(0)
                trailing = re.search(r"\s*$", text).group(0)
                entries.append((tag, "attr", attr, text.strip(), leading, trailing))

    translations = translate_cores([entry[3] for entry in entries], translator, cache)

    for target, kind, attr, core, leading, trailing in entries:
        translated = f"{leading}{translations[core]}{trailing}"
        if kind == "node":
            target.replace_with(translated)
        else:
            target[attr] = translated

    return str(soup)


def spanish_permalink(permalink: str, source_type: str) -> str:
    if not permalink.startswith("/en/"):
        return permalink
    next_permalink = permalink.replace("/en/", "/", 1)
    next_permalink = CONFLICTING_PERMALINKS.get(next_permalink, next_permalink)
    return next_permalink


def translate_file(path: Path, translator, cache: dict[str, str]) -> None:
    raw = path.read_text(encoding="utf-8")
    frontmatter, content = split_frontmatter(raw)
    if frontmatter.get("language") == "es":
        return
    source_type = frontmatter.get("sourceType", "")

    frontmatter["title"] = translate_text(str(frontmatter.get("title", "")), translator, cache)
    if frontmatter.get("description"):
        frontmatter["description"] = translate_text(str(frontmatter["description"]), translator, cache)
    if frontmatter.get("imageAlt"):
        frontmatter["imageAlt"] = translate_text(str(frontmatter["imageAlt"]), translator, cache)

    frontmatter["permalink"] = spanish_permalink(str(frontmatter.get("permalink", "")), source_type)
    frontmatter["language"] = "es"
    frontmatter["translatedFrom"] = "en"
    frontmatter["sourceType"] = {
        "Post": "Artículo",
        "Page": "Página",
        "FAQ": "FAQ",
    }.get(source_type, source_type)
    frontmatter["contentType"] = frontmatter["sourceType"]
    frontmatter["tags"] = [
        tag
        for tag in frontmatter.get("tags", [])
        if tag not in {"englishMirror", "importedPosts", "importedPages", "importedFaqs"}
    ]
    frontmatter["tags"].append("traducido")

    translated_content = translate_html(content, translator, cache)
    path.write_text(f"---\n{dump_frontmatter(frontmatter)}\n---\n{translated_content}\n", encoding="utf-8")


def main() -> None:
    translator = get_translation()
    cache = load_cache()
    files = sorted(IMPORTED_ROOT.glob("**/*.md"))

    for index, path in enumerate(files, start=1):
        translate_file(path, translator, cache)
        if index % 10 == 0:
            save_cache(cache)
            print(f"Traducidos {index}/{len(files)}")

    save_cache(cache)
    print(f"Traducidos {len(files)}/{len(files)}")


if __name__ == "__main__":
    main()
