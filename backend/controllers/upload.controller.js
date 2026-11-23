/* POST /upload/image  — multer handles the file, cloudinary stores it */
export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    // req.file.path is the Cloudinary secure URL after multer-storage-cloudinary
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleImageUploadError = (error, _req, res, _next) => {
  const cloudinaryError = error.error && typeof error.error === "object"
    ? error.error
    : error;
  const httpCode = cloudinaryError.http_code;

  console.error("Image upload failed:", {
    message: cloudinaryError.message || error.message,
    httpCode,
    code: error.code,
  });

  if (httpCode === 401 || /api_secret mismatch/i.test(cloudinaryError.message || "")) {
    return res.status(502).json({
      message: "Image service authentication failed. Check the Cloudinary credentials configured on the backend.",
    });
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "Image must be 5 MB or smaller." });
  }

  return res.status(500).json({ message: "Unable to upload image. Check the backend image service configuration." });
};
