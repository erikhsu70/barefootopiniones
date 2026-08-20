(() => {
  const content = document.querySelector(".article-body");
  if (!content) return;

  const slugCounts = new Map();

  content.querySelectorAll("h2, h3").forEach((heading) => {
    const text = heading.textContent.trim();
    if (!text) return;

    const baseSlug = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "seccion";
    const count = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, count + 1);

    if (!heading.id) heading.id = count ? `${baseSlug}-${count + 1}` : baseSlug;
  });
})();
