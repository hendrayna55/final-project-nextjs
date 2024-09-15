import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation } from '@/hooks/useMutation';
import { useRouter } from 'next/router';
import { useModal } from '@/context/ModalContext';

const AddPostModal = () => {
    const router = useRouter();
    const { mutate } = useMutation();
    const toast = useToast();
    const { isAddModalOpen, closeAddModal } = useModal(); // Gunakan state modal dari useModal
    const [isValid, setIsValid] = useState(true);
    const [post, setPost] = useState({
        description: ""
    });

    const handlePost = async () => {
        if (post.description === "") {
            setIsValid(false);
            toast({
                title: "Post Failed!",
                description: "Jangan kosongkan data",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
        } else {
            const response = await mutate({
                url: 'https://service.pace-unv.cloud/api/post',
                payload: post
            });

            if (response?.success) {
                toast({
                    title: "Post Success",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                });

                router.reload();
            } else {
                toast({
                    title: "Post Gagal",
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
            onClose={closeAddModal}
            isOpen={isAddModalOpen} // Kontrol state modal dari useModal
            motionPreset='slideInBottom'
            size={'xl'}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>New Post</ModalHeader>
                <ModalBody>
                    <Textarea
                        placeholder="What's new?"
                        variant={"flushed"}
                        onChange={(event) => setPost({ ...post, description: event.target.value })}
                        isInvalid={!isValid}
                    />
                </ModalBody>
                <ModalFooter justifyContent={'space-between'}>
                    <Button variant={'ghost'} size={'sm'} mr={3} onClick={closeAddModal}>
                        Close
                    </Button>
                    <Button colorScheme='blue' size={'sm'} onClick={handlePost}>
                        Post
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddPostModal;
