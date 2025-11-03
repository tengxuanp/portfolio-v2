'use client';
import React, { useState, useCallback } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Input,
  Tabs,
  Tab,
  Card,
  CardBody,
  Image,
  Progress
} from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImageInsert: (imageSrc: string) => void;
  postId: string;
}

interface UploadedImage {
  url: string;
  name: string;
  size: number;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onOpenChange,
  onImageInsert,
  postId
}) => {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    console.log(`📤 Starting upload of ${files.length} files for post ${postId}`);
    
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('postId', postId);
    
    files.forEach((file, index) => {
      console.log(`📎 Adding file ${index + 1}: ${file.name} (${file.size} bytes, ${file.type})`);
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication
      });

      // Check if response has content before parsing JSON
      const responseText = await response.text();
      let result;
      
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        console.error('Response text:', responseText);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (response.ok) {
        if (result.files && Array.isArray(result.files)) {
          const newImages = result.files.map((url: string, index: number) => ({
            url,
            name: files[index]?.name || 'Unknown',
            size: files[index]?.size || 0,
          }));
          
          setUploadedImages(prev => [...prev, ...newImages]);
          setUploadProgress(100);
          
          // Auto-insert first image if only one uploaded
          if (newImages.length === 1) {
            onImageInsert(newImages[0].url);
            onOpenChange(false);
          }
        } else {
          throw new Error('Invalid response format: missing files array');
        }
      } else {
        const errorMessage = result.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.';
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    uploadFiles(acceptedFiles);
  }, [postId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB max per file
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    uploadFiles(files);
  };

  const insertImageByUrl = () => {
    if (urlInput.trim()) {
      onImageInsert(urlInput.trim());
      setUrlInput('');
      onOpenChange(false);
    }
  };

  const insertUploadedImage = (imageUrl: string) => {
    onImageInsert(imageUrl);
    onOpenChange(false);
  };

  const deleteImage = async (imageUrl: string) => {
    try {
      const response = await fetch(`/api/upload?path=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedImages(prev => prev.filter(img => img.url !== imageUrl));
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2>Add Images to Post</h2>
            </ModalHeader>
            <ModalBody>
              <Tabs 
                selectedKey={activeTab} 
                onSelectionChange={(key) => setActiveTab(key as string)}
                className="w-full"
              >
                <Tab key="upload" title="Upload Files">
                  <div className="space-y-4">
                    {/* Drag & Drop Zone */}
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                        isDragActive 
                          ? 'border-primary bg-primary/10' 
                          : 'border-default-300 hover:border-primary/50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="space-y-2">
                        <div className="text-4xl">📁</div>
                        <p className="text-lg font-medium">
                          {isDragActive 
                            ? 'Drop images here...' 
                            : 'Drag & drop images here, or click to browse'
                          }
                        </p>
                        <p className="text-sm text-default-500">
                          Supports PNG, JPG, GIF, WebP, SVG • Max 10MB per file
                        </p>
                      </div>
                    </div>

                    {/* Manual File Selection */}
                    <div className="flex justify-center">
                      <Button 
                        color="primary" 
                        variant="bordered"
                        onPress={() => document.getElementById('file-input')?.click()}
                      >
                        Choose Files
                      </Button>
                      <input
                        id="file-input"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                      <div className="space-y-2">
                        <Progress 
                          value={uploadProgress} 
                          color="primary" 
                          className="w-full"
                        />
                        <p className="text-sm text-center">Uploading images...</p>
                      </div>
                    )}

                    {/* Uploaded Images Gallery */}
                    {uploadedImages.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">Uploaded Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {uploadedImages.map((image, index) => (
                            <Card key={index} className="relative">
                              <CardBody className="p-2">
                                <Image
                                  src={image.url}
                                  alt={image.name}
                                  className="w-full h-24 object-cover rounded"
                                />
                                <div className="mt-2 space-y-1">
                                  <p className="text-xs truncate" title={image.name}>
                                    {image.name}
                                  </p>
                                  <p className="text-xs text-default-500">
                                    {formatFileSize(image.size)}
                                  </p>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      color="primary"
                                      variant="flat"
                                      onPress={() => insertUploadedImage(image.url)}
                                      className="text-xs h-6"
                                    >
                                      Insert
                                    </Button>
                                    <Button
                                      size="sm"
                                      color="danger"
                                      variant="flat"
                                      onPress={() => deleteImage(image.url)}
                                      className="text-xs h-6"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab key="url" title="Image URL">
                  <div className="space-y-4">
                    <Input
                      label="Image URL"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          insertImageByUrl();
                        }
                      }}
                    />
                    <p className="text-sm text-default-500">
                      Enter a direct link to an image hosted online
                    </p>
                    <Button 
                      color="primary" 
                      onPress={insertImageByUrl}
                      disabled={!urlInput.trim()}
                      className="w-full"
                    >
                      Insert Image
                    </Button>
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ImageUploadModal;
