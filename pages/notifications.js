import Loading from '@/components/spinner/loading';
import { useQueries } from '@/hooks/useQueries';
import { GridItem as ChakraGridItem, Card, Heading, CardBody, Stack, Box, Text, StackDivider, Spinner, useToast, Textarea, Button, Grid, Menu, MenuButton, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,  } from "@chakra-ui/react";
import { useMutation } from '@/hooks/useMutation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaHeart, FaSearch, FaHome, FaPlus, FaUser, FaSignOutAlt, FaBell } from 'react-icons/fa';
import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function NotificationsPage() {
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
    const dataUser  = useQueries({
        prefixUrl: 'https://service.pace-unv.cloud/api/user/me',
    });

    const [isValid, setIsValid] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
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

    const openModal = () => {
        setPost({ description: '' }); // Reset form for adding
        setIsEditMode(false); // Add mode
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

    const getNotifications = useQueries({
        prefixUrl: `https://service.pace-unv.cloud/api/notifications`
    });

    // Fungsi untuk menghitung apakah waktu adalah hari ini
    const isToday = (date) => {
        const now = new Date();
        const givenDate = new Date(date);

        return now.toDateString() === givenDate.toDateString();
    };

    // Fungsi untuk mendapatkan waktu relatif (sekian menit/jam yang lalu)
    const getRelativeTime = (date) => {
        const now = new Date();
        const givenDate = new Date(date);
        const diffInMilliseconds = now - givenDate;
        const diffInMinutes = Math.floor(diffInMilliseconds / 60000);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} menit yang lalu`;
        } else {
            const diffInHours = Math.floor(diffInMinutes / 60);
            return `${diffInHours} jam yang lalu`;
        }
    };

    // Fungsi untuk menampilkan tanggal dan waktu
    const formatDateTime = (date) => {
        const givenDate = new Date(date);
        return givenDate.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Fungsi untuk menampilkan waktu yang sesuai
    const displayTime = (date) => {
        if (isToday(date)) {
            return getRelativeTime(date); // Tampilkan waktu relatif jika hari ini
        } else {
            return formatDateTime(date); // Tampilkan tanggal dan waktu jika lebih dari hari ini
        }
    };

    // Fungsi untuk meng-hash username menjadi warna
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 50%)`; // Warna berdasarkan hue (HSL)
        return color;
    };

    // Fungsi untuk mengambil inisial dari username
    const getInitials = (name) => {
        const names = name.split(' ');
        const initials = names.map((n) => n[0]).join('');
        return initials.toUpperCase();
    };
    
    return (
        <>
            <div>
                <Head>
                    <title>{`Kenshusei Forum - Home`}</title>
                    <meta name='description' content={'Aplikasi Forum Kenshusei Japan'} />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel='icon' href='/japan-gapura.png' />
                </Head>

                <div className="flex flex-col min-h-screen bg-japan">
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
                    
                    <main>
                        {getNotifications?.isLoading || dataUser?.isLoading ? (
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
                                            {
                                                getNotifications?.isLoading ? (
                                                    <Loading/>
                                                ) : (
                                                    <>
                                                        {
                                                            getNotifications?.data?.data.length > 0 ? (
                                                                <>
                                                                    {
                                                                        getNotifications?.data?.data.map((item) => (
                                                                            <ChakraGridItem key={item.id}>
                                                                                <Card>
                                                                                    <CardBody>
                                                                                        <Stack divider={<StackDivider />}>
                                                                                            <Box>
                                                                                                <Heading size='xs' className="flex justify-between items-center">
                                                                                                    <div className="flex justify-between items-center">
                                                                                                        <div
                                                                                                            className="rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-2"
                                                                                                            style={{ backgroundColor: stringToColor(item.user.name) }}
                                                                                                        >
                                                                                                            {getInitials(item.user.name)}
                                                                                                        </div>

                                                                                                        <div className="bg-gray-300 px-2 py-1 rounded-full text-black mr-4">{item.user.name}</div>
                                                                                                        <div className=" text-black">{item.remark} postingan kamu</div>

                                                                                                    </div>
                                                                                                    <Text fontSize='md' className='font-normal'>
                                                                                                        {displayTime(item.created_at)} {/* Menampilkan waktu dengan logika */}
                                                                                                    </Text>
                                                                                                </Heading>
                                                                                            </Box>
                                                                                        </Stack>
                                                                                    </CardBody>
                                                                                </Card>
                                                                            </ChakraGridItem>
                                                                        ))
                                                                    }
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className='bg-gray-800 bg-opacity-80 rounded-lg shadow-md py-2 text-white my-3'>
                                                                        <div className='flex items-center justify-center'>
                                                                            <h5 className='text-md font-bold'>You're not have notifications</h5>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    </>
                                                )
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
        </>
    )
}
