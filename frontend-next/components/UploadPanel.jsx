"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { FiUpload, FiFile, FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const acceptedFileTypes = [
  ".fasta", ".fa", ".txt", ".csv", ".json",
  ".pdb", ".mol", ".sdf", ".xyz"
];

export default function UploadPanel({ onFileUpload, isLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, []);

  const handleFiles = useCallback((files) => {
    const validFiles = files.filter(file => {
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      return acceptedFileTypes.includes(extension);
    });

    if (validFiles.length === 0) {
      setUploadStatus({ type: 'error', message: 'Please select valid file types: ' + acceptedFileTypes.join(', ') });
      return;
    }

    setUploadedFiles(validFiles);
    setUploadStatus({ type: 'success', message: `${validFiles.length} file(s) selected successfully` });

    // Auto-upload after a brief delay
    setTimeout(() => {
      onFileUpload(validFiles);
    }, 1000);
  }, [onFileUpload]);

  const removeFile = useCallback((index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    if (newFiles.length === 0) {
      setUploadStatus(null);
    }
  }, [uploadedFiles]);

  const clearAll = useCallback(() => {
    setUploadedFiles([]);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card rounded-3xl p-8"
    >
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold gradient-text">Upload Molecular Data</h2>
        <p className="text-slate-400">
          Upload your protein sequences, structures, or molecular data for enzyme prediction analysis
        </p>
      </div>

      {/* Upload Zone */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-500/10 scale-105'
            : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            animate={isDragOver ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm">
              <FiUpload className="h-10 w-10 text-cyan-400" />
            </div>
          </motion.div>

          <h3 className="mb-2 text-xl font-semibold text-white">
            {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p className="mb-6 text-slate-400">
            or click to browse your files
          </p>

          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Choose Files'}
          </motion.button>

          <p className="text-sm text-slate-500">
            Supported formats: {acceptedFileTypes.join(', ')}
          </p>
        </div>

        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"
          animate={isDragOver ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Status Message */}
      <AnimatePresence>
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 flex items-center gap-3 rounded-lg p-4 ${
              uploadStatus.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            {uploadStatus.type === 'success' ? (
              <FiCheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <FiAlertCircle className="h-5 w-5 text-red-400" />
            )}
            <span className={uploadStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}>
              {uploadStatus.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Selected Files</h3>
              <motion.button
                onClick={clearAll}
                className="text-sm text-slate-400 hover:text-red-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear all
              </motion.button>
            </div>

            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                      <FiFile className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-sm text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => removeFile(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex items-center justify-center gap-3 rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm"
          >
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
            <span className="text-slate-300">Processing your files...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
