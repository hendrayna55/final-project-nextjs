// context/PostContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@/hooks/useMutation';
import { useQueries } from '@/hooks/useQueries';
import Cookies from 'js-cookie';
import { useToast } from '@chakra-ui/react';

const PostContext = createContext();

export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [post, setPost] = useState({ description: '' });
    const toast = useToast();
    const { mutate } = useMutation();

    const dataPost = useQueries({
        prefixUrl: 'https://service.pace-unv.cloud/api/posts?type=all',
    });

    const openModal = (id = null) => {
        if (id) {
            setSelectedPostId(id);
            setIsEditMode(true);
        } else {
            setPost({ description: '' });
            setIsEditMode(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleLike = async (id) => {
        const response = await mutate({
            url: `https://service.pace-unv.cloud/api/likes/post/${id}`,
        });

        if (response?.success) {
            toast({
                title: 'Like Success!',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            });
            // Refresh post data
        } else {
            toast({
                title: 'Like Gagal!',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const handleUnlike = async (id) => {
        const response = await mutate({
            url: `https://service.pace-unv.cloud/api/unlikes/post/${id}`,
        });

        if (response?.success) {
            toast({
                title: 'Unlike Success!',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            });
            // Refresh post data
        } else {
            toast({
                title: 'Unlike Gagal!',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const handleSubmitPost = async () => {
        const url = isEditMode
            ? `https://service.pace-unv.cloud/api/post/update/${selectedPostId}`
            : `https://service.pace-unv.cloud/api/post`;
        const method = isEditMode ? 'PATCH' : 'POST';

        const response = await mutate({
            url,
            method,
            payload: post,
        });

        if (response?.success) {
            toast({
                title: `${isEditMode ? 'Update' : 'Add'} Post Success!`,
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            });
        } else {
            toast({
                title: `${isEditMode ? 'Update' : 'Add'} Post Gagal!`,
                description: response?.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            });
        }
        closeModal();
    };

    return (
        <PostContext.Provider value={{
            isModalOpen, openModal, closeModal, post, setPost, handleLike, handleUnlike, handleSubmitPost, dataPost,
        }}>
            {children}
        </PostContext.Provider>
    );
};
