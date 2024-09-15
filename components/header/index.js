import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Spinner } from '@chakra-ui/react';
import { useQueries } from '@/hooks/useQueries';
import Image from 'next/image';
import Link from 'next/link';

function Header({ onSelectPostType }) {
    const dataUser = useQueries({
        prefixUrl: 'https://service.pace-unv.cloud/api/user/me',
    });

    const HandleJenisPost = (jenis) => {
        const url = `https://service.pace-unv.cloud/api/posts?type=${jenis}`;
        onSelectPostType(url); // Mengirim URL yang dipilih ke Home
    };

    return (
        <>
            <div className="hidden md:flex items-center justify-center pb-4 border-b sticky top-0 p-4 border-none z-50">
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        {dataUser?.isLoading ? <Spinner /> : dataUser?.data?.data.name}
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => HandleJenisPost("all")}>All Post</MenuItem>
                        <MenuItem onClick={() => HandleJenisPost("me")}>Your Post</MenuItem>
                    </MenuList>
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
    );
}

export default Header;
