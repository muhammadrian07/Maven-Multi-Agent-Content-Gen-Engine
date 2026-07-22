"""
Lightweight web search for Deep Search mode.

Tries DuckDuckGo first (best for SERP-style snippets). If rate-limited,
falls back to DuckDuckGo Instant Answer + Wikipedia OpenSearch so the
specialist prompt still receives live sources.
"""

from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import quote_plus

import requests


@dataclass
class SearchHit:
    title: str
    url: str
    snippet: str


def web_search(query: str, *, max_results: int = 8) -> list[SearchHit]:
    query = (query or "").strip()
    if not query:
        return []

    hits = _search_duckduckgo_ddgs(query, max_results=max_results)
    if hits:
        return hits[:max_results]

    hits = _search_duckduckgo_instant(query)
    wiki = _search_wikipedia(query, max_results=max_results)
    merged = hits + wiki
    # de-dupe by URL/title
    seen: set[str] = set()
    unique: list[SearchHit] = []
    for hit in merged:
        key = (hit.url or hit.title).lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(hit)
        if len(unique) >= max_results:
            break
    return unique


def format_search_results(hits: list[SearchHit]) -> str:
    if not hits:
        return (
            "Live web search results:\n"
            "(No live results were available for this query — search may be "
            "rate-limited. Say so briefly, then give careful niche suggestions "
            "marked as knowledge-based estimates — not evidence from live SERPs.)"
        )

    lines = ["Live web search results:"]
    for i, hit in enumerate(hits, start=1):
        lines.append(f"{i}. {hit.title}")
        if hit.url:
            lines.append(f"   URL: {hit.url}")
        if hit.snippet:
            lines.append(f"   Snippet: {hit.snippet}")
    return "\n".join(lines)


def _search_duckduckgo_ddgs(query: str, *, max_results: int) -> list[SearchHit]:
    try:
        from duckduckgo_search import DDGS
    except ImportError:
        return []

    hits: list[SearchHit] = []
    try:
        results = DDGS().text(query, max_results=max_results)
        for row in results or []:
            title = (row.get("title") or "").strip()
            url = (row.get("href") or row.get("link") or "").strip()
            snippet = (row.get("body") or row.get("snippet") or "").strip()
            if not title and not snippet:
                continue
            hits.append(SearchHit(title=title, url=url, snippet=snippet))
    except Exception:
        return []
    return hits


def _search_duckduckgo_instant(query: str) -> list[SearchHit]:
    try:
        response = requests.get(
            "https://api.duckduckgo.com/",
            params={"q": query, "format": "json", "no_html": 1, "skip_disambig": 1},
            timeout=12,
            headers={"User-Agent": "MavenDeepSearch/1.0"},
        )
        response.raise_for_status()
        data = response.json()
    except Exception:
        return []

    hits: list[SearchHit] = []
    heading = (data.get("Heading") or "").strip()
    abstract = (data.get("AbstractText") or "").strip()
    abstract_url = (data.get("AbstractURL") or "").strip()
    if abstract:
        hits.append(
            SearchHit(
                title=heading or query,
                url=abstract_url,
                snippet=abstract,
            )
        )

    for topic in data.get("RelatedTopics") or []:
        if len(hits) >= 5:
            break
        if isinstance(topic, dict) and "Text" in topic:
            hits.append(
                SearchHit(
                    title=(topic.get("Text") or "")[:80],
                    url=(topic.get("FirstURL") or "").strip(),
                    snippet=(topic.get("Text") or "").strip(),
                )
            )
        elif isinstance(topic, dict) and "Topics" in topic:
            for sub in topic.get("Topics") or []:
                if len(hits) >= 5:
                    break
                hits.append(
                    SearchHit(
                        title=(sub.get("Text") or "")[:80],
                        url=(sub.get("FirstURL") or "").strip(),
                        snippet=(sub.get("Text") or "").strip(),
                    )
                )
    return [h for h in hits if h.snippet or h.title]


def _search_wikipedia(query: str, *, max_results: int) -> list[SearchHit]:
    headers = {"User-Agent": "MavenDeepSearch/1.0"}
    # Try a few shorter variants — long niche prompts often return empty opensearch.
    variants = _query_variants(query)
    hits: list[SearchHit] = []

    for variant in variants:
        if len(hits) >= max_results:
            break
        try:
            response = requests.get(
                "https://en.wikipedia.org/w/api.php",
                params={
                    "action": "query",
                    "list": "search",
                    "srsearch": variant,
                    "srlimit": max_results,
                    "format": "json",
                    "utf8": 1,
                },
                timeout=12,
                headers=headers,
            )
            response.raise_for_status()
            data = response.json()
        except Exception:
            continue

        for row in (data.get("query") or {}).get("search") or []:
            title = (row.get("title") or "").strip()
            snippet = (row.get("snippet") or "").replace('<span class="searchmatch">', "")
            snippet = snippet.replace("</span>", "").strip()
            if not title:
                continue
            url = f"https://en.wikipedia.org/wiki/{quote_plus(title.replace(' ', '_'))}"
            hits.append(SearchHit(title=title, url=url, snippet=snippet))
            if len(hits) >= max_results:
                break

    return hits


def _query_variants(query: str) -> list[str]:
    q = " ".join((query or "").split())
    if not q:
        return []
    variants = [q]
    words = [w for w in q.split() if len(w) > 2]
    stop = {
        "find",
        "low",
        "competition",
        "high",
        "roi",
        "for",
        "the",
        "and",
        "with",
        "about",
        "help",
        "me",
        "please",
        "want",
        "looking",
    }
    focused = [w for w in words if w.lower() not in stop]
    if focused:
        variants.append(" ".join(focused[:6]))
        variants.append(" ".join(focused[:3]))
    # unique preserve order
    seen: set[str] = set()
    out: list[str] = []
    for v in variants:
        key = v.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(v)
    return out
