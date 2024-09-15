import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@chakra-ui/react';
import { usePost } from '@/contexts/PostContext';

const ModalPost = ({ isOpen, onClose }) => {
    const { post, setPost, handleSubmitPost, isEditMode } = usePost();

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isEditMode ? 'Edit Post' : 'Add New Post'}</ModalHeader>
                <ModalBody>
                    <Textarea
                        placeholder="What's on your mind?"
                        value={post.description}
                        onChange={(e) => setPost({ ...post, description: e.target.value })}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmitPost}>
                        {isEditMode ? 'Update Post' : 'Post'}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalPost;
