const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: function (req, file, cb) {
        const allowedExtensions = ['.txt', '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.json', '.md'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'), false);
        }
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileInfo = {
            original_name: req.file.originalname,
            stored_name: req.file.filename,
            size: req.file.size,
            type: req.file.mimetype,
            uploaded_at: new Date().toISOString()
        };

        // Save metadata
        const metadataPath = path.join('uploads', req.file.filename + '.meta');
        fs.writeFileSync(metadataPath, JSON.stringify(fileInfo, null, 2));

        res.json({
            success: true,
            message: 'File uploaded successfully! 🎉',
            file: {
                ...fileInfo,
                download_url: `/download/${req.file.filename}`
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
});

app.get('/files', (req, res) => {
    try {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            return res.json({ files: [] });
        }

        const files = fs.readdirSync(uploadDir)
            .filter(filename => !filename.endsWith('.meta'))
            .map(filename => {
                const filePath = path.join(uploadDir, filename);
                const stats = fs.statSync(filePath);
                const metadataPath = path.join(uploadDir, filename + '.meta');
                
                let originalName = filename;
                if (fs.existsSync(metadataPath)) {
                    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                    originalName = metadata.original_name;
                }

                return {
                    filename: filename,
                    original_name: originalName,
                    size: stats.size,
                    type: path.extname(filename),
                    uploaded_at: stats.mtime.toISOString()
                };
            });

        res.json({ files: files });
    } catch (error) {
        res.status(500).json({ error: 'Failed to list files: ' + error.message });
    }
});

app.get('/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join('uploads', filename);
        const metadataPath = path.join('uploads', filename + '.meta');

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        let originalName = filename;
        if (fs.existsSync(metadataPath)) {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            originalName = metadata.original_name;
        }

        res.download(filePath, originalName);
    } catch (error) {
        res.status(500).json({ error: 'Download failed: ' + error.message });
    }
});

app.delete('/delete/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join('uploads', filename);
        const metadataPath = path.join('uploads', filename + '.meta');

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        if (fs.existsSync(metadataPath)) {
            fs.unlinkSync(metadataPath);
        }

        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Delete failed: ' + error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        upload_folder: 'uploads',
        max_file_size: '10MB',
        allowed_extensions: ['.txt', '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.json', '.md']
    });
});

// Error handling
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large (max 10MB)' });
        }
    }
    res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Starting Hello World Confetti App with File Upload Server...');
    console.log(`📁 Upload folder: uploads`);
    console.log(`📏 Max file size: 10MB`);
    console.log(`✅ Allowed extensions: .txt, .pdf, .png, .jpg, .jpeg, .gif, .doc, .docx, .xls, .xlsx, .csv, .json, .md`);
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
}); 