const fs = require("fs/promises");
const path = require("path");
const { UPLOAD_DIR } = require("../config/env");

function resolveUploadPath(imageUrl) {
  if (!imageUrl || !imageUrl.includes("/uploads/")) {
    return null;
  }

  return path.join(UPLOAD_DIR, path.basename(imageUrl));
}

async function deleteUpload(imageUrl) {
  const uploadPath = resolveUploadPath(imageUrl);
  if (!uploadPath) {
    return;
  }

  try {
    await fs.unlink(uploadPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

module.exports = deleteUpload;
