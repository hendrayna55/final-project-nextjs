import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSearch, FaHome, FaPlus, FaHeart, FaUser, FaSignOutAlt, FaEllipsisH, FaRegHeart, FaCommentDots, FaBell } from "react-icons/fa";
import { Button, Grid, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Textarea, useToast, GridItem as ChakraGridItem, Card, Heading, CardBody, Stack, Box, Text, StackDivider } from "@chakra-ui/react";
import { useQueries } from "@/hooks/useQueries";
import Loading from "@/components/spinner/loading";

export default function Home() {
    const [isLogout, setIsLogout] = useState(false);
    const toast = useToast();
    const { mutate } = useMutation();
    const router = useRouter();
    const [post, setPost] = useState({
        description: ""
    });

    const HandleLogout = async () => {
        setIsLogout(true);

        const response = await mutate(
            {
                url: 'https://service.pace-unv.cloud/api/logout',
                headers: {
                    Authorization: `Bearer ${Cookies.get("user_token")}`,
                },
            },
        );
        
        if (!response?.success) {
            toast({
                title: "Logout Gagal",
                description: response?.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
            
            setIsLogout(false);
        } else {
            toast({
                title: "Berhasil Logout",
                description: response?.message,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });

            Cookies.remove("user_token");

            router.push('/login');
        }
    };

    const dataUser = useQueries({
        prefixUrl: 'https://service.pace-unv.cloud/api/user/me',
    });

    const dataPost = useQueries({
        prefixUrl: 'https://service.pace-unv.cloud/api/posts?type=all',
    });

    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 50%)`;
        return color;
    };

    const getInitials = (name) => {
        const names = name.split(' ');
        return names.map((n) => n[0]).join('').toUpperCase();
    };

    const handleLike = async (id) => {
        const response = await mutate({
            url: `https://service.pace-unv.cloud/api/likes/post/${id}`,
        });

        if (response?.success) {
            toast({
                title: "Like Success",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });

            setTimeout(() => {
                router.reload();
            }, 1000);
        } else {
            toast({
                title: "Like Gagal",
                description: response?.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
        }
    };

    const handleUnlike = async (id) => {
        const response = await mutate({
            url: `https://service.pace-unv.cloud/api/unlikes/post/${id}`,
        });

        if (response?.success) {
            toast({
                title: "Unlike Success",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });

            setTimeout(() => {
                router.reload();
            }, 1000);
        } else {
            toast({
                title: "Unlike Gagal",
                description: response?.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
        }
    };

    const [isValid, setIsValid] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch selected post for editing
    useEffect(() => {
        if (isEditMode && selectedPostId) {
            async function fetchingData() {
                const res = await fetch(
                    `https://service.pace-unv.cloud/api/post/${selectedPostId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${Cookies.get("user_token")}`
                        },
                    }
                );
                const dataPostId = await res.json();
                
                setPost({description: dataPostId?.data?.description} || {});
            }
            fetchingData();
        }
    }, [selectedPostId, isEditMode]);

    const openModal = (id = null) => {
        if (id) {
            setSelectedPostId(id);
            setIsEditMode(true); // Edit mode
        } else {
            setPost({ description: '' }); // Reset form for adding
            setIsEditMode(false); // Add mode
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPostId(null);
    };

    const handleSubmit = async () => {
        if (post.description == "") {
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
            setIsValid(true);
            const url = isEditMode
                ? `https://service.pace-unv.cloud/api/post/update/${selectedPostId}`
                : `https://service.pace-unv.cloud/api/post`;
            
            const method = isEditMode ? "PATCH" : "POST";
            
            const response = await mutate({
                url: url,
                method: method,
                payload: post
            });
            
            if (response?.success) {
                toast({
                    title: `${isEditMode ? "Update" : "Add"} Post Success!`,
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                });
                setTimeout(() => {
                    router.reload();
                }, 1000);
            } else {
                toast({
                    title: `${isEditMode ? "Update" : "Add"} Post Failed!`,
                    description: response?.message,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                });
            }
            closeModal();
        }
    };

    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const HandleDelete = (id) => {
        setSelectedPostId(id);
        setModalDeleteOpen(true);
    };

    const closeModalDelete = () => {
        setModalDeleteOpen(false);
        setSelectedPostId(null);
    };

    const handleSubmitDelete = async () => {
        const response = await mutate({
            url: `https://service.pace-unv.cloud/api/post/delete/${selectedPostId}`,
            method: "DELETE"
        });
        
        if (response?.success) {
            toast({
                title: `Delete Post Success!`,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
            setTimeout(() => {
                router.reload();
            }, 1000);
        } else {
            toast({
                title: `Delete Post Failed!`,
                description: response?.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
        }
        closeModalDelete();
    };

    const [openComment, setOpenComment] = useState(false);
    const [comment, setComment] = useState({
        id: "",
        description: ""
    });
    const [dataComments, setDataComments] = useState(null);

    const HandleComment = async (id) => {
        const res = await fetch(
            `https://service.pace-unv.cloud/api/replies/post/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("user_token")}`
                },
            }
        );
        const listComment = await res.json();
        
        setComment({
            id: id,
            description: ""
        });
        setDataComments(listComment);
        setOpenComment(true);
    };

    const closeModalComment = () => {
        setOpenComment(false);
        setSelectedPostId(null);
    };

    const submitComment = async () => {
        if (comment.description == "") {
            toast({
                title: "Comment Failed!",
                description: "Jangan kosongkan comment",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
        } else {
            const response = await mutate({
                url: `https://service.pace-unv.cloud/api/replies/post/${comment.id}`,
                method: "POST",
                payload: {
                    description: comment.description
                }
            });

            if (response.success) {
                toast({
                    title: response.message,
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                });
                HandleComment(comment.id);
            } else {
                toast({
                    title: "Comment Failed!",
                    description: response.message,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                });
                HandleComment(comment.id);
            }
        }
        setComment({ ...comment, description: "" });
    };

    const handleDeleteComment = async (id) => {
        console.log("ID Comment => ", id);
        const response = await mutate({
            url: `https://service.pace-unv.cloud/api/replies/delete/${id}`,
            method: "DELETE",
        });

        if (response.success) {
            toast({
                title: response.message,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
            HandleComment(comment.id);
        } else {
            toast({
                title: "Comment Failed!",
                description: response.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
            HandleComment(comment.id);
        }
    };

    return (
        <div>
            <Head>
                <title>{`Kenshusei Forum - Home`}</title>
                <meta name='description' content={'Aplikasi Forum Kenshusei Japan'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel='icon' href='/japan-gapura.png' />
            </Head>

            <div className="flex flex-col min-h-screen">
                {/* Header */}
                <div className="hidden md:flex items-center justify-center pb-4 border-b sticky top-0 p-4 border-none z-50">
                    <Menu>
                        <MenuButton as={Button} onClick={() => router.push('/profile')} color={'black'}>
                            Welcome, {dataUser?.isLoading ? <Spinner /> : dataUser?.data?.data.name}!
                        </MenuButton>
                    </Menu>
                </div>

                <div className="md:hidden fixed top-0 left-0 w-full bg-white flex justify-around py-3 z-50">
                    <div className="float-end">
                        <Link href={"/"}>
                            <Image src={'/japan-gapura.png'} alt="app-logo" width="55" height="55" className='hover:scale-110 duration-150 transition delay-0' />
                        </Link>
                    </div>
                </div>

                {/* Sidebar di desktop */}
                <div className="md:flex hidden w-16 md:w-20 bg-gray-800 bg-opacity-80 fixed left-0 top-0 h-screen flex-col justify-between py-6 items-center shadow-md">
                    {/* Bagian atas */}
                    <Link href={"/"} className="hover:scale-110 duration-150 transition delay-0">
                        <Image src={'/japan-gapura.png'} alt="app-logo" className='' width="50" height="50"/>
                    </Link>

                    {/* Bagian tengah */}
                    <div className="space-y-8 items-center justify-center">
                        <div className="flex flex-col gap-8">
                            <Link href={"/"}>
                                <FaHome className="w-8 h-8 text-white"/>
                            </Link>
                            <Link href={"/notifications"}>
                                <FaBell className="w-8 h-8 text-white"/>
                            </Link>
                            {/* Tombol Add Post */}
                            <button type="button" onClick={() => openModal()}>
                                <FaPlus className="w-8 h-8 text-white" />
                            </button>
                            <Link href={"/profile"}>
                                <FaUser className="w-8 h-8 text-white"/>
                            </Link>
                        </div>
                    </div>

                    {/* Bagian bawah */}
                    <div className="space-y-8">
                        <div className="flex flex-col justify-center items-center gap-5">
                            {
                                isLogout ? (
                                    <Spinner
                                        color='red.500'
                                        thickness='4px'
                                        size={'lg'}
                                    />
                                ) : (
                                    <Button colorScheme='teal'  variant='link' onClick={() => HandleLogout()}>
                                        <FaSignOutAlt className="w-8 h-8 text-white"/>
                                    </Button>
                                )
                            }
                        </div>
                    </div>
                </div>

                {/* Menu di bawah untuk tampilan mobile */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white flex justify-around items-center py-3 z-50">
                    <Link href={"/"}>
                        <FaHome className="w-6 h-6 text-black"/>
                    </Link>
                    <Link href={"/"}>
                        <FaSearch className="w-6 h-6 text-black"/>
                    </Link>
                    <button type="button" onClick={() => openModal()}>
                        <FaPlus className="w-8 h-8 text-black" />
                    </button>
                    <Link href={"/"}>
                        <FaHeart className="w-6 h-6 text-black"/>
                    </Link>
                    <Link href={"/profile"}>
                        <FaUser className="w-6 h-6 text-black"/>
                    </Link>
                </div>

                {/* Modal for Add/Edit Post */}
                <Modal isOpen={isModalOpen} onClose={closeModal} size={'xl'} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{isEditMode ? 'Update Post' : 'Add Post'}</ModalHeader>
                        <ModalBody>
                            <Grid gap={5}>
                                <ChakraGridItem>
                                    <Textarea 
                                        onChange={(event) => setPost({ ...post, description: event.target.value })}
                                        value={post?.description}
                                        isInvalid={!isValid}
                                    />
                                </ChakraGridItem>
                            </Grid>
                        </ModalBody>

                        <ModalFooter justifyContent={'space-between'}>
                            <Button size={'sm'} variant="ghost" mr={3} onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button size={'sm'} colorScheme="blue" onClick={handleSubmit}>
                                {isEditMode ? 'Update' : 'Post'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Modal for Delete Post */}
                <Modal isOpen={modalDeleteOpen} onClose={closeModalDelete} size={'xl'} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader color={'red'}>Delete Post</ModalHeader>
                        <ModalBody>
                            <Grid gap={5}>
                                <ChakraGridItem>
                                    Are you sure delete this post ?
                                </ChakraGridItem>
                            </Grid>
                        </ModalBody>

                        <ModalFooter justifyContent={'space-between'}>
                            <Button size={'sm'} variant="ghost" mr={3} onClick={closeModalDelete}>
                                Cancel
                            </Button>
                            <Button size={'sm'} colorScheme="red" onClick={handleSubmitDelete}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Modal for Comment Post */}
                <Modal isOpen={openComment} onClose={closeModalComment} size={'2xl'}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Comment Post</ModalHeader>
                        <ModalBody>
                            <Grid gap={2}>
                                <ChakraGridItem >
                                    <Textarea 
                                        value={comment.description}
                                        onChange={(event) => setComment({ ...comment, description: event.target.value })}
                                    />
                                </ChakraGridItem>

                                <ChakraGridItem >
                                    <Button size={'sm'} w={'full'} colorScheme={'blue'} onClick={() => submitComment()}>Reply</Button>
                                </ChakraGridItem>

                                {
                                    dataComments?.data.map((item) => (
                                        <ChakraGridItem key={item.id}>
                                            <Card>
                                                <CardBody>
                                                    <Stack divider={<StackDivider />} spacing='4'>
                                                        <Box>
                                                            <Heading size='xs' className="flex justify-between items-center">
                                                                <div className="flex justify-between items-center">
                                                                    <div
                                                                        className="rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-2"
                                                                        style={{ backgroundColor: stringToColor(item.user.name) }}
                                                                    >
                                                                        {getInitials(item.user.name)}
                                                                    </div>

                                                                    <div className="bg-gray-300 px-2 py-1 rounded-full text-black">{item.user.name}</div>
                                                                </div>
                                                                {
                                                                    item.is_own_reply && <Button colorScheme={'red'} size={'sm'} onClick={() => handleDeleteComment(item.id)}>Hapus</Button>
                                                                }
                                                            </Heading>
                                                            <Text pt='2' fontSize='xs'>
                                                                {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                                    weekday: 'long',
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })} 
                                                            </Text>
                                                            <Text pt='2' fontSize='lg'>
                                                                {item.description}
                                                            </Text>
                                                        </Box>
                                                    </Stack>
                                                </CardBody>
                                            </Card>
                                        </ChakraGridItem>
                                    ))
                                }
                            </Grid>
                        </ModalBody>

                        <ModalFooter>
                            <Button size={'sm'} onClick={closeModalComment}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                
                <main>
                    {dataPost?.isLoading ? (
                        <div className='flex-1 flex justify-center items-center pb-16'>
                            <div className='w-full max-w-md md:max-w-sm'>
                                <div className='p-4 md:p-4 space-y-4 md:space-y-6'>
                                    <Loading />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 flex justify-center pb-16 mt-20 md:mt-0 z-0">
                                <div className="w-full max-w-md md:max-w-2xl">
                                    <div className="p-4 md:p-4 space-y-4 md:space-y-3">
                                        <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-md p-4 flex justify-center items-center">
                                            <Textarea
                                                placeholder="What's new?"
                                                color={'white'}
                                                variant={"flushed"}
                                                onClick={() => openModal()}
                                            />
                                        </div>

                                        {
                                            dataPost?.data?.data.map((item) => {
                                                const isEdited = new Date(item.created_at).getTime() !== new Date(item.updated_at).getTime();
                                                return (
                                                    <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-md p-4 text-white relative" key={item.id}>
                                                        <div className="flex items-start">
                                                            {/* Avatar with Initials */}
                                                            <div
                                                                className="rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-3"
                                                                style={{ backgroundColor: stringToColor(item.user.name) }}
                                                            >
                                                                {getInitials(item.user.name)}
                                                            </div>
                                                            
                                                            <div className="flex-grow">
                                                                <Link 
                                                                    href={item.is_own_post ? `/profile` : `/profile/${item.user.id}`}
                                                                >
                                                                    <h2 className="font-semibold">
                                                                        {item.user.name} {item.is_own_post && "(You)"}
                                                                    </h2>
                                                                </Link>
                                                                <p className="text-sm text-white">
                                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                                        day: '2-digit',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    })} 
                                                                    {isEdited && <span className="ml-2 text-xs text-black bg-white px-1 rounded">Edited</span>}
                                                                </p>
                                                                {/* Deskripsi */}
                                                                <p className="mt-2">{item.description}</p>

                                                                {/* Button Like dan Komen */}
                                                                <div className="flex items-center mt-2 space-x-4">
                                                                    {/* Like Button */}
                                                                    <button
                                                                        onClick={item.is_like_post ? () => handleUnlike(item.id) : () => handleLike(item.id)}
                                                                        className={`flex items-center ${item.is_like_post ? 'text-red-500' : 'text-white'} focus:outline-none`}
                                                                    >
                                                                        {item.is_like_post ? <FaHeart className="w-5 h-5 mr-1" /> : <FaRegHeart className="w-5 h-5 mr-1" />}
                                                                        <span className='text-white'>{item.likes_count}</span> {/* Tampilkan likes count dari JSON */}
                                                                    </button>

                                                                    {/* Comment Count */}
                                                                    <button onClick={() => HandleComment(item.id)} className="flex items-center text-white focus:outline-none">
                                                                        <FaCommentDots className="w-5 h-5 mr-1" />
                                                                        <span className='text-white'>{item.replies_count}</span>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Titik Tiga (Menu Opsi) */}
                                                            {
                                                                item.is_own_post && 
                                                                <Menu>
                                                                    <MenuButton color={'gray.100'}>
                                                                        <FaEllipsisH />
                                                                    </MenuButton>
                                                                    <MenuList >
                                                                        <MenuItem color={'black'} onClick={() => openModal(item?.id)}>Edit</MenuItem>
                                                                        <MenuItem color={'red'} onClick={() => HandleDelete(item.id)}>Delete</MenuItem>
                                                                    </MenuList>
                                                                </Menu>
                                                            }
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>

                <button 
                    className="hidden md:block fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition" 
                    onClick={() => openModal()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
