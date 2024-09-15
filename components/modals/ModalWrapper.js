// components/ModalWrapper.js
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';

const ModalWrapper = ({ isOpen, onClose, title, bodyContent, footerButtons }) => (
  <Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{bodyContent}</ModalBody>
      <ModalFooter>{footerButtons}</ModalFooter>
    </ModalContent>
  </Modal>
);

export default ModalWrapper;
