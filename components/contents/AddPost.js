import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation } from '@/hooks/useMutation';
import { useRouter } from 'next/router';

export default function AddPostButton() {
    const router = useRouter();
    const {mutate} = useMutation();
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [post, setPost] = useState({
        description: ""
    });

    const HandlePost = async () => {
        if (post.description == "") {
            setIsValid(false);
            toast({
                title: "Post Failed!",
                description: "Jangan kosongkan datamu",
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

                setTimeout(() => {
                    router.reload();
                }, 3000);
            } else {
                toast({
                    title: "Post Gagal",
                    description: response?.message,
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                });
            }
        }
    };

    const openModal = () => {
        setPost({ description: '' });
        setIsModalOpen(true);
        setIsValid(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPost(null);
        setIsValid(true);
    };

    return (
        <>
            <button 
                className="hidden md:block fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition" 
                onClick={openModal}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

            <Modal
                isCentered
                onClose={closeModal}
                isOpen={isModalOpen}
                motionPreset='slideInBottom'
                size={'xl'}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>New Post</ModalHeader>

                    <ModalBody className=''>
                        <Textarea
                            placeholder="What's new?"
                            className=''
                            onChange={(event) => setPost({...post, description:event.target.value})}
                            isInvalid={!isValid}
                        />
                    </ModalBody>

                    <ModalFooter justifyContent={'space-between'}>
                        <Button variant={'ghost'} size={'sm'} mr={3} onClick={closeModal}>
                            Close
                        </Button>
                        <Button colorScheme='blue' size={'sm'} onClick={() => HandlePost()}>
                            Post
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    );
};
