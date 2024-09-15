import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Button, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useMutation } from '@/hooks/useMutation';
import { useRouter } from 'next/router';
import { useModal } from '@/context/ModalContext';

const EditPostModal = () => {
    const router = useRouter();
    const { mutate } = useMutation();
    const toast = useToast();
    const { isEditModalOpen, closeEditModal, editingPost } = useModal(); // Gunakan editingPost dari context
    const [post, setPost] = useState({
        description: ""
    });

    // Set isi dari post ketika modal terbuka
    useEffect(() => {
        if (editingPost) {
            setPost({ description: editingPost.description });
        }
    }, [editingPost]);

    const handlePostEdit = async () => {
        if (post.description === "") {
            toast({
                title: "Edit Failed!",
                description: "Jangan kosongkan data",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
        } else {
            const response = await mutate({
                url: `https://service.pace-unv.cloud/api/post/${editingPost.id}`,
                method: 'PATCH',
                payload: post
            });

            if (response?.success) {
                toast({
                    title: "Post Updated",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                });

                router.reload();
            } else {
                toast({
                    title: "Edit Gagal",
                    description: response?.message,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                });
            }
        }
    };

    return (
        <Modal
            isCentered
            onClose={closeEditModal}
            isOpen={isEditModalOpen} // Modal untuk edit post
            motionPreset='slideInBottom'
            size={'xl'}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Post</ModalHeader>
                <ModalBody>
                    <Textarea
                        value={post.description}
                        placeholder="Edit your post"
                        onChange={(event) => setPost({ ...post, description: event.target.value })}
                    />
                </ModalBody>
                <ModalFooter justifyContent={'space-between'}>
                    <Button variant={'ghost'} size={'sm'} mr={3} onClick={closeEditModal}>
                        Close
                    </Button>
                    <Button colorScheme='blue' size={'sm'} onClick={handlePostEdit}>
                        Update Post
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditPostModal;
