#!/usr/bin/env python3
"""
File Upload Server for Hello World Confetti App
Handles file uploads, validation, and storage for guest users
"""

from flask import Flask, request, jsonify, send_from_directory, render_template_string
from werkzeug.utils import secure_filename
import os
import uuid
import json
from datetime import datetime
import mimetypes

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'json', 'md'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_info(filename):
    """Get file information"""
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(filepath):
        stat = os.stat(filepath)
        return {
            'filename': filename,
            'size': stat.st_size,
            'uploaded_at': datetime.fromtimestamp(stat.st_mtime).isoformat(),
            'type': mimetypes.guess_type(filename)[0] or 'application/octet-stream'
        }
    return None

@app.route('/')
def index():
    """Serve the main HTML page"""
    with open('index.html', 'r') as f:
        return f.read()

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload"""
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file was selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Generate unique filename
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        
        # Save file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        # Get file info
        file_info = get_file_info(unique_filename)
        
        # Save metadata
        metadata = {
            'original_name': original_filename,
            'stored_name': unique_filename,
            'uploaded_at': datetime.now().isoformat(),
            'size': file_info['size'],
            'type': file_info['type']
        }
        
        metadata_file = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_filename}.meta")
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f)
        
        return jsonify({
            'success': True,
            'message': 'File uploaded successfully! 🎉',
            'file': {
                'original_name': original_filename,
                'stored_name': unique_filename,
                'size': file_info['size'],
                'type': file_info['type'],
                'download_url': f'/download/{unique_filename}'
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@app.route('/files', methods=['GET'])
def list_files():
    """List all uploaded files"""
    try:
        files = []
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            if not filename.endswith('.meta'):
                file_info = get_file_info(filename)
                if file_info:
                    # Get original filename from metadata
                    metadata_file = os.path.join(app.config['UPLOAD_FOLDER'], f"{filename}.meta")
                    if os.path.exists(metadata_file):
                        with open(metadata_file, 'r') as f:
                            metadata = json.load(f)
                            file_info['original_name'] = metadata.get('original_name', filename)
                    
                    files.append(file_info)
        
        return jsonify({'files': files})
        
    except Exception as e:
        return jsonify({'error': f'Failed to list files: {str(e)}'}), 500

@app.route('/download/<filename>')
def download_file(filename):
    """Download a file"""
    try:
        # Validate filename
        if not os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
            return jsonify({'error': 'File not found'}), 404
        
        # Get original filename from metadata
        metadata_file = os.path.join(app.config['UPLOAD_FOLDER'], f"{filename}.meta")
        original_name = filename
        if os.path.exists(metadata_file):
            with open(metadata_file, 'r') as f:
                metadata = json.load(f)
                original_name = metadata.get('original_name', filename)
        
        return send_from_directory(
            app.config['UPLOAD_FOLDER'], 
            filename, 
            as_attachment=True,
            download_name=original_name
        )
        
    except Exception as e:
        return jsonify({'error': f'Download failed: {str(e)}'}), 500

@app.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    """Delete a file"""
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        metadata_file = os.path.join(app.config['UPLOAD_FOLDER'], f"{filename}.meta")
        
        # Delete file and metadata
        if os.path.exists(filepath):
            os.remove(filepath)
        if os.path.exists(metadata_file):
            os.remove(metadata_file)
        
        return jsonify({'success': True, 'message': 'File deleted successfully'})
        
    except Exception as e:
        return jsonify({'error': f'Delete failed: {str(e)}'}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'upload_folder': app.config['UPLOAD_FOLDER'],
        'max_file_size': app.config['MAX_CONTENT_LENGTH'],
        'allowed_extensions': list(ALLOWED_EXTENSIONS)
    })



# Uploads page route
@app.route('/uploads')
def uploads_page():
    return send_from_directory('.', 'uploads.html')

# Fixed uploads page route
@app.route('/uploads-fixed')
def uploads_fixed_page():
    return send_from_directory('.', 'uploads-fixed.html')

# API endpoint to get list of uploaded files
@app.route('/api/uploads')
def get_uploads():
    try:
        files = []
        upload_dir = 'uploads'
        if os.path.exists(upload_dir):
            for filename in os.listdir(upload_dir):
                file_path = os.path.join(upload_dir, filename)
                if os.path.isfile(file_path):
                    stat = os.stat(file_path)
                    files.append({
                        'name': filename,
                        'size': stat.st_size,
                        'type': get_file_type(filename),
                        'uploadDate': stat.st_mtime * 1000  # Convert to milliseconds
                    })
        return jsonify(files)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API endpoint to delete a file
@app.route('/api/uploads/<filename>', methods=['DELETE'])
def delete_upload(filename):
    try:
        file_path = os.path.join('uploads', filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_file_type(filename):
    """Determine file type based on extension"""
    ext = filename.lower().split('.')[-1] if '.' in filename else ''
    type_mapping = {
        'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif',
        'pdf': 'application/pdf',
        'txt': 'text/plain', 'md': 'text/markdown', 'json': 'application/json',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xls': 'application/vnd.ms-excel',
        'doc': 'application/msword', 'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'csv': 'text/csv'
    }
    return type_mapping.get(ext, 'application/octet-stream')

if __name__ == '__main__':
    print("🚀 Starting Hello World Confetti App with File Upload Server...")
    print(f"📁 Upload folder: {UPLOAD_FOLDER}")
    print(f"📏 Max file size: {MAX_FILE_SIZE / (1024*1024):.1f}MB")
    print(f"✅ Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}")
    print("🌐 Server running at: http://localhost:8000")
    
    app.run(debug=True, host='0.0.0.0', port=8000) 