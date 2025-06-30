import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { useApp } from '../../contexts/AppContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import {
  Upload,
  FileText,
  File,
  X,
  Check,
  AlertCircle,
  Eye,
  Tag,
  Trash2,
  RefreshCw
} from 'lucide-react';
import apiService from '../../services/api';

export interface UploadFile {
  file: File;
  id: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  selectedCategories: string[];
  error?: string;
}

// ... imports remain the same ...

export const UploadData: React.FC = () => {
  const { categories, documents, loading, error, addDocument, deleteDocument, loadPageData } = useApp();
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPageData('upload');
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const validTypes = [
      // 'application/pdf',
      // 'application/msword',
      // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // 'text/plain',
      "application/json"
    ];
    const validFiles = files.filter(file => validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024);

    const uploadingFiles: UploadFile[] = validFiles.map(file => ({
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0,
      selectedCategories: []
    }));

    setUploadFiles(prev => [...prev, ...uploadingFiles]);

    // Start real upload
    await uploadToServer(uploadingFiles);
  };

  const uploadToServer = async (uploadFiles: UploadFile[]) => {
    const filesOnly = uploadFiles.map(f => f.file); // ✅ Extract actual File objects

    try {
      const result = await apiService.uploadDocument(filesOnly, []);

      if (result.success) {
        setUploadFiles(prev => prev.filter(f => !uploadFiles.find(u => u.id === f.id)));
        await loadPageData('upload');
      } else {
        setUploadFiles(prev =>
          prev.map(f => uploadFiles.find(u => u.id === f.id)
            ? { ...f, status: 'error', error: result.error || 'Upload failed' }
            : f
          )
        );
      }
    } catch (err) {
      setUploadFiles(prev =>
        prev.map(f => uploadFiles.find(u => u.id === f.id)
          ? { ...f, status: 'error', error: 'Upload error' }
          : f
        )
      );
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />;
    if (type.includes('word')) return <File className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />;
    return <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading.categories || loading.documents) {
    return (
      <Layout title="Upload Data" subtitle="Upload company documents to enhance AI knowledge base">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading upload page..." />
        </div>
      </Layout>
    );
  }

  if (error.categories || error.documents) {
    return (
      <Layout title="Upload Data" subtitle="Upload company documents to enhance AI knowledge base">
        <ErrorMessage
          message={error.categories || error.documents || 'Failed to load data'}
          onRetry={() => loadPageData('upload')}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Upload Data" subtitle="Upload company documents to enhance AI knowledge base">
      <div className="space-y-6">
        {/* Upload UI */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to upload</h3>
            <p className="text-sm text-gray-600 mb-4">
              JSON files up to 10MB
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Uploading Files (progress UI) */}
        {uploadFiles.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploading...</h3>
            <div className="space-y-4">
              {uploadFiles.map((file) => (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.file.type)}
                      <div>
                        <p className="font-medium text-gray-900 text-sm truncate">{file.file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.file.size)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-500 animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
            <p className="text-sm text-gray-500">{documents.length} documents</p>
          </div>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((document) => (
                <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {getFileIcon(document.type)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">{document.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(document.size)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button onClick={() => setPreviewDocument(document)} className="text-gray-400 hover:text-blue-500">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteDocument(document.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {document.categories?.slice(0, 2).map((catId) => {
                      const cat = categories.find(c => c.id === catId);
                      return cat ? (
                        <span key={cat.id} className={`${cat.color} text-white text-xs px-2 py-1 rounded-full`}>
                          {cat.name}
                        </span>
                      ) : null;
                    })}
                    {document.categories?.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{document.categories.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500">No documents uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
