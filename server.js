const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const uploadDir = path.join(__dirname, 'uploads');
// Serve static files (index.html and assets) from project root so frontend and API share origin
app.use(express.static(__dirname));
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const id = Date.now() + '-' + Math.random().toString(36).slice(2,9);
    const ext = path.extname(file.originalname);
    cb(null, id + ext);
  }
});

const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

// POST /upload - single file field name 'photo'
app.post('/upload', upload.single('photo'), (req, res) => {
  const f = req.file;
  if (!f) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${encodeURIComponent(f.filename)}`;
  res.json({ id: f.filename, name: f.originalname, url });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// GET /photos - list all uploaded files
app.get('/photos', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir).filter(Boolean).map(filename => ({
      id: filename,
      url: `/uploads/${encodeURIComponent(filename)}`,
      name: filename
    }));
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list photos' });
  }
});

// DELETE /photos/:id - delete a file by id (filename)
app.delete('/photos/:id', (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const filePath = path.join(uploadDir, id);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(404).json({ error: 'File not found' });
    res.json({ ok: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Upload server running on http://localhost:${PORT}`));
