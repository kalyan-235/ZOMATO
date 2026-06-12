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
