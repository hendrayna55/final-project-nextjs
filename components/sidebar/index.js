import { useMutation } from '@/hooks/useMutation';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { usePost } from '@/contexts/PostContext';
import { FaBell, FaHeart, FaHome, FaPlus, FaSearch, FaSignOutAlt, FaUser } from 'react-icons/fa';

const SideBar = () => {
    const { openModal } = usePost();
    const router = useRouter();
    const [isLogout, setIsLogout] = useState(false);
    const toast = useToast();
    const { mutate } = useMutation();
    
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

    return (
        <>
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
        </>
    )
}

export default SideBar