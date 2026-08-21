(() => {
  const content = document.querySelector(".article-body");
  if (!content) return;

  const slugCounts = new Map();
  const usedIds = new Set();

  content.querySelectorAll("h2, h3").forEach((heading) => {
    const text = heading.textContent.trim();
    if (!text) return;

    const baseSlug = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "seccion";
    const preferredSlug = heading.id || baseSlug;
    let count = slugCounts.get(preferredSlug) || 0;
    let uniqueSlug = count ? `${preferredSlug}-${count + 1}` : preferredSlug;

    while (usedIds.has(uniqueSlug)) {
      count += 1;
      uniqueSlug = `${preferredSlug}-${count + 1}`;
    }

    slugCounts.set(preferredSlug, count + 1);
    usedIds.add(uniqueSlug);
    heading.id = uniqueSlug;
  });

  const toc = document.querySelector("[data-article-toc]");
  const mobileToc = document.querySelector("[data-article-toc-mobile]");
  if (!toc || !mobileToc || toc.childElementCount || mobileToc.childElementCount) return;

  const utilityHeadingPattern = /^(indice|tabla de contenidos|contenidos|en este articulo|table of contents)$/i;
  const headings = [...content.querySelectorAll("h2")].filter((heading) => {
    const normalizedText = heading.textContent
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return normalizedText
      && !utilityHeadingPattern.test(normalizedText)
      && !heading.closest("[data-toc-exclude], .article-author-card");
  });

  if (!headings.length) {
    toc.closest(".article-toc")?.remove();
    mobileToc.closest(".article-toc-mobile")?.remove();
    return;
  }

  const list = document.createElement("ol");
  headings.forEach((heading) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    item.append(link);
    list.append(item);
  });

  toc.append(list);
  mobileToc.append(list.cloneNode(true));
})();
