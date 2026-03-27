function buildFileUrl(req, file) {
  if (!file) {
    return undefined;
  }

  return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
}

module.exports = buildFileUrl;
