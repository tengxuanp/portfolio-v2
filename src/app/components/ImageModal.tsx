'use client'
// components/ImageModal.tsx
import React, { useState } from 'react';
import {Modal, ModalContent, ModalBody, Button, useDisclosure, Image, ModalFooter} from '@nextui-org/react';

interface ImageModalProps {
  src: string;
  alt: string;
  action: string;
  link: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, action, link }) => {

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [size, setSize] = React.useState('5xl');

  const handleOpen = () => {
    setSize("5xl")
    onOpen();
  }

  const handleActionClick = () => {
    window.open(link, '_blank');
  };

  return (
    <>
      <Image 
        src={src}
        alt={alt}
        onClick={() => handleOpen()}
        style={{ cursor: 'pointer' }}
        width={400}
        height={200}
      />
      <Modal
        closeButton
        aria-labelledby="modal-title"
        isOpen={isOpen} 
        onClose={onClose} 
        size={size}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <Image
                  src={src}
                  alt={alt}
                  width="100%"
                  height="auto"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleActionClick}>
                  {action}
                </Button>
              </ModalFooter>
            </>
            )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ImageModal
