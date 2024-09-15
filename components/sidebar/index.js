import { FaSearch, FaHome, FaPlus, FaHeart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useMutation } from '@/hooks/useMutation';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Spinner, useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
    const [isLogout, setIsLogout] = useState(false);
    const toast = useToast();
    const { mutate } = useMutation();
    const router = useRouter();

    const HandleLogout = async () => {
        setIsLogout(true);

        const response = await mutate(
            {
                url: 'https://service.pace-unv.cloud/api/logout',
                headers: {
                    Authorization : `Bearer ${Cookies.get("user_token")}`,
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

            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    };

    return (
        <>
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
                        <Link href={"/"}>
                            <FaSearch className="w-8 h-8 text-white"/>
                        </Link>
                        {/* Tombol Add Post */}
                        <button type="button">
                            <FaPlus className="w-8 h-8 text-white" />
                        </button>
                        <Link href={"/"}>
                            <FaHeart className="w-8 h-8 text-white"/>
                        </Link>
                        <Link href={"/profile"}>
                            <FaUser className="w-8 h-8 text-white"/>
                        </Link>
                    </div>
                </div>

                {/* Bagian bawah */}
                <div className="space-y-8">
                    <div className="flex flex-col justify-center items-center gap-5">
                        <Link href={"/"}>
                            <FaGear className="w-8 h-8 text-white"/>
                        </Link>

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
                <button type="button">
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
    );
};

export default Sidebar;