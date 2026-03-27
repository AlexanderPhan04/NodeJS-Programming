function parseTags(rawTags) {
  if (Array.isArray(rawTags)) {
    return rawTags
      .flatMap((tag) => (typeof tag === "string" ? tag.split(",") : []))
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof rawTags !== "string") {
    return [];
  }

  const trimmed = rawTags.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((tag) => String(tag).trim()).filter(Boolean);
    }
  } catch (error) {
    // Fall back to comma-separated tags for form-data inputs.
  }

  return trimmed
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizePostBody(req, res, next) {
  if (Object.prototype.hasOwnProperty.call(req.body, "tags")) {
    req.body.tags = parseTags(req.body.tags);
  }

  if (req.file) {
    req.body.imageChanged = true;
  }

  next();
}

module.exports = normalizePostBody;
