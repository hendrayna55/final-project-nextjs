import { useQueries } from '@/hooks/useQueries';
import { Button, Menu, MenuButton, Spinner } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Header = () => {
    const dataUser = useQueries({
        prefixUrl: 'https://service.pace-unv.cloud/api/user/me',
    });

    return (
        <>
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
        </>
    )
}

export default Header;