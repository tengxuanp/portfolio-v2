'use client';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import { createLowlight, all } from 'lowlight';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import ImageUploadModal from './ImageUploadModal';

// Create lowlight instance with all languages
const lowlight = createLowlight(all);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  postId?: string; // Add postId for image uploads
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing...",
  postId = `temp-${Date.now()}` // Generate temporary ID if not provided
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageUrl, setImageUrl] = React.useState('');
  const [linkUrl, setLinkUrl] = React.useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [isToolbarSticky, setIsToolbarSticky] = useState(false);
  const [manualFloatingToolbar, setManualFloatingToolbar] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle scroll to show/hide floating toolbar
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      if (!toolbarRef.current || !editorContainerRef.current) return;

      const toolbarRect = toolbarRef.current.getBoundingClientRect();
      const editorRect = editorContainerRef.current.getBoundingClientRect();
      
      // Show floating toolbar when main toolbar is out of view but editor is still visible
      // Use more lenient conditions for modal environments
      const toolbarOutOfView = toolbarRect.bottom < 10; // Allow small margin
      const editorInView = editorRect.top < window.innerHeight && editorRect.bottom > 50;
      
      // Auto-show floating toolbar when needed (but don't override manual setting)
      if (!manualFloatingToolbar) {
        setShowFloatingToolbar(toolbarOutOfView && editorInView);
      }
      setIsToolbarSticky(toolbarRect.top <= 0 && editorRect.bottom > 100);
    };

    // Listen to both window scroll and all scroll events that might affect the editor
    const addScrollListeners = () => {
      // Window scroll
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Find and listen to modal scroll containers
      const modalElements = document.querySelectorAll('[role="dialog"], .modal, [data-slot="base"]');
      modalElements.forEach(modal => {
        const scrollableContent = modal.querySelector('[data-slot="body"], .modal-body, .overflow-y-auto');
        if (scrollableContent) {
          scrollableContent.addEventListener('scroll', handleScroll, { passive: true });
        }
      });
      
      // Also listen to any parent containers that might scroll
      let parent = editorContainerRef.current?.parentElement;
      while (parent && parent !== document.body) {
        const computedStyle = window.getComputedStyle(parent);
        if (computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll') {
          parent.addEventListener('scroll', handleScroll, { passive: true });
        }
        parent = parent.parentElement;
      }
    };

    // Initial setup
    addScrollListeners();
    
    // Re-setup listeners if DOM changes (e.g., modal opens)
    const observer = new MutationObserver(() => {
      setTimeout(addScrollListeners, 100); // Small delay for DOM to settle
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      
      // Clean up modal scroll listeners
      const modalElements = document.querySelectorAll('[role="dialog"], .modal, [data-slot="base"]');
      modalElements.forEach(modal => {
        const scrollableContent = modal.querySelector('[data-slot="body"], .modal-body, .overflow-y-auto');
        if (scrollableContent) {
          scrollableContent.removeEventListener('scroll', handleScroll);
        }
      });
    };
  }, [isMounted, manualFloatingToolbar]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block to use lowlight version
        bulletList: false, // Disable to use custom configuration
        orderedList: false, // Disable to use custom configuration  
        listItem: false, // Disable to use custom configuration
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'bash',
      }),
      // Explicit list extensions for better control
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'tiptap-bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'tiptap-ordered-list',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        protocols: ['http', 'https', 'mailto', 'tel'],
        validate: (url) => {
          // Allow all URLs, just ensure they're not empty
          return Boolean(url && url.trim().length > 0);
        },
      }),
    ],
    content,
    immediatelyRender: false, // Fix SSR hydration issues
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
        style: 'white-space: pre-wrap;',
      },
    },
  });

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      onOpenChange();
    }
  }, [editor, imageUrl, onOpenChange]);

  const insertImageFromModal = useCallback((imageSrc: string) => {
    if (imageSrc && editor) {
      editor.chain().focus().setImage({ 
        src: imageSrc,
        alt: 'Uploaded image',
        title: 'Click to view full size'
      }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!linkUrl?.trim() || !editor) {
      return;
    }

    let validUrl = linkUrl.trim();
    
    // Handle different URL formats
    if (!validUrl.startsWith('http://') && 
        !validUrl.startsWith('https://') && 
        !validUrl.startsWith('mailto:') &&
        !validUrl.startsWith('tel:')) {
      validUrl = `https://${validUrl}`;
    }
    
    try {
      // Get current selection
      const { from, to, empty } = editor.state.selection;
      
      if (empty) {
        // No text selected, insert URL as clickable link
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${validUrl}">${validUrl}</a>`)
          .run();
      } else {
        // Text is selected, apply link to selection
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: validUrl })
          .run();
      }
      
      // Close modal and clear input
      setLinkUrl('');
      setIsLinkModalOpen(false);
      
    } catch (error) {
      console.error('Error setting link:', error);
      // Fallback: just insert as text
      editor.chain().focus().insertContent(validUrl).run();
      setLinkUrl('');
      setIsLinkModalOpen(false);
    }
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  }, [editor]);

  // Reusable toolbar component
  const Toolbar = ({ isCompact = false, className = "" }) => {
    if (!editor) return null;
    
    return (
    <div className={`flex flex-wrap gap-2 p-3 border-b border-default-200 bg-default-50 ${className}`}>
      {/* Text Formatting */}
      <Button
        size="sm"
        variant={editor.isActive('bold') ? 'solid' : 'light'}
        onPress={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('italic') ? 'solid' : 'light'}
        onPress={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </Button>
      
      {/* Divider */}
      <div className="w-px h-6 bg-default-200 mx-1" />
      
      {/* Headings */}
      <Button
        size="sm"
        variant={editor.isActive('heading', { level: 1 }) ? 'solid' : 'light'}
        onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'light'}
        onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('heading', { level: 3 }) ? 'solid' : 'light'}
        onPress={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </Button>
      
      {/* Divider */}
      <div className="w-px h-6 bg-default-200 mx-1" />
      
      {/* Lists */}
      <Button
        size="sm"
        variant={editor.isActive('bulletList') ? 'solid' : 'light'}
        onPress={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().toggleBulletList()}
      >
        • List
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('orderedList') ? 'solid' : 'light'}
        onPress={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().toggleOrderedList()}
      >
        1. Numbered
      </Button>
      
      {/* Divider */}
      <div className="w-px h-6 bg-default-200 mx-1" />
      
      {/* Media & Links - Always show these essential tools */}
      <Button
        size="sm"
        variant="light"
        onPress={() => setIsImageModalOpen(true)}
      >
        {isCompact ? "📷" : "📷 Image"}
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('link') ? 'solid' : 'light'}
        onPress={() => {
          try {
            if (editor.isActive('link')) {
              removeLink();
            } else {
              const attrs = editor.getAttributes('link');
              const currentUrl = attrs.href || '';
              setLinkUrl(currentUrl);
              setIsLinkModalOpen(true);
            }
          } catch (error) {
            console.error('Link button error:', error);
            setLinkUrl('');
            setIsLinkModalOpen(true);
          }
        }}
      >
        {isCompact ? (editor.isActive('link') ? '🔗✕' : '🔗') : (editor.isActive('link') ? '🔗 Unlink' : '🔗 Link')}
      </Button>

      {/* Additional tools for full toolbar */}
      {!isCompact && (
        <>
          <Button
            size="sm"
            variant={editor.isActive('code') ? 'solid' : 'light'}
            onPress={() => editor.chain().focus().toggleCode().run()}
          >
            Code
          </Button>
          
          <div className="w-px h-6 bg-default-200 mx-1" />
          
          <Button
            size="sm"
            variant={editor.isActive('blockquote') ? 'solid' : 'light'}
            onPress={() => editor.chain().focus().toggleBlockquote().run()}
          >
            Quote
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('codeBlock') ? 'solid' : 'light'}
            onPress={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            Code Block
          </Button>
          
          <div className="w-px h-6 bg-default-200 mx-1" />
          
          <Button
            size="sm"
            variant="light"
            onPress={() => editor.chain().focus().setHorizontalRule().run()}
          >
            HR
          </Button>
          <Button
            size="sm"
            variant="light"
            onPress={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            ↶ Undo
          </Button>
          <Button
            size="sm"
            variant="light"
            onPress={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            ↷ Redo
          </Button>
        </>
      )}
    </div>
    );
  };

  // Debug editor state
  useEffect(() => {
    if (editor && isMounted) {
      console.log('TipTap Editor initialized with extensions:', editor.extensionManager.extensions.map(ext => ext.name));
      
      // Add click handler to test links
      const handleClick = (event: Event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'A') {
          console.log('Link clicked:', target.getAttribute('href'));
        }
      };
      
      const editorElement = editor.view.dom;
      editorElement.addEventListener('click', handleClick);
      
      return () => {
        editorElement.removeEventListener('click', handleClick);
      };
    }
  }, [editor, isMounted]);

  if (!isMounted) {
    return (
      <div className="border border-default-200 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-default-200 rounded mb-2"></div>
          <div className="h-32 bg-default-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      <div ref={editorContainerRef} className="border border-default-200 rounded-lg tiptap-editor">
        {/* Main Toolbar */}
        <div ref={toolbarRef}>
          <Toolbar isCompact={false} />
        </div>

        {/* Editor Content */}
        <div className="min-h-[300px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Manual Floating Toolbar Toggle - Always available */}
      <Button
        size="sm"
        variant="solid"
        color="primary"
        onPress={() => {
          const newState = !showFloatingToolbar;
          setShowFloatingToolbar(newState);
          setManualFloatingToolbar(newState); // Track manual override
        }}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        title={showFloatingToolbar ? "Hide floating toolbar" : "Show floating toolbar"}
      >
        {showFloatingToolbar ? "🔧 Hide" : "🔧 Tools"}
      </Button>

      {/* Floating Toolbar - appears when main toolbar is out of view OR manually toggled */}
      {(showFloatingToolbar || manualFloatingToolbar) && (
        <div className="floating-toolbar fixed top-4 right-4 z-40 border border-default-200 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center justify-between p-2 border-b border-default-200">
            <span className="text-sm font-medium text-default-600">✨ Quick Tools</span>
            <Button
              size="sm"
              variant="light"
              onPress={() => {
                setShowFloatingToolbar(false);
                setManualFloatingToolbar(false); // Clear manual override
              }}
              className="min-w-unit-8 w-unit-8 h-unit-8 hover:bg-danger-50 hover:text-danger-500"
            >
              ✕
            </Button>
          </div>
          <Toolbar isCompact={true} className="border-b-0" />
        </div>
      )}

      {/* Sticky Toolbar - sticks to top when scrolling */}
      {isToolbarSticky && (
        <div className="sticky-toolbar fixed top-0 left-0 right-0 z-40 border-b border-default-200 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 px-4">
              <span className="text-xs text-default-500 font-medium">📝 Editing Tools</span>
              <div className="flex-1">
                <Toolbar isCompact={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onOpenChange={setIsImageModalOpen}
        onImageInsert={insertImageFromModal}
        postId={postId}
      />

      {/* Simple URL Image Modal (kept as backup) */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Image by URL</ModalHeader>
              <ModalBody>
                <Input
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={addImage}>
                  Add Image
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Link Modal */}
      <Modal isOpen={isLinkModalOpen} onOpenChange={(open) => {
        setIsLinkModalOpen(open);
        if (!open) {
          setLinkUrl('');
        }
      }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Link</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Link URL"
                  placeholder="https://example.com or example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setLink();
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      setLinkUrl('');
                      setIsLinkModalOpen(false);
                    }
                  }}
                />
                <div className="text-sm text-default-500 mt-2">
                  <p>💡 <strong>Tip:</strong> Select text first, then add a link to make it clickable.</p>
                  <p>If no text is selected, the URL will be inserted as clickable text.</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={() => {
                  setLinkUrl('');
                  onClose();
                }}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={setLink}
                  disabled={!linkUrl?.trim()}
                >
                  Add Link
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RichTextEditor;
