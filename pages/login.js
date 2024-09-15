import {
    Button,
    FormControl,
    Input, InputGroup, InputRightElement, Spinner, useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useMutation } from '@/hooks/useMutation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LayoutComponent = dynamic(() => import('@/layout/guest'));

export default function Login() {
    const [ showPw, setShowPw ] = useState(false);
    const handlePassword = () => setShowPw(!showPw);
    const router = useRouter();
    const toast = useToast();
    const { mutate } = useMutation();
    const [payload, setPayload] = useState(
        {
            email: "",
            password: ""
        }
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successLogin, setSuccessLogin] = useState(false);

    const HandleSubmit = async () => {
        setIsSubmitting(true);

        if (payload.email == "" || payload.password == "") {
            toast({
                title: "Login Gagal",
                description: "Isi data Login",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });
            setIsSubmitting(false);
        } else {
            const response = await mutate(
                {
                    url: "https://service.pace-unv.cloud/api/login",
                    payload
                }
            );

            if (response?.success) {
                toast({
                    title: "Login Success",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                });

                Cookies.set(
                    'user_token',
                    response?.data.token,
                    {
                        expires: new Date(response?.data?.expires_at),
                        path: "/"
                    }
                );
                setSuccessLogin(true);

                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } else {
                toast({
                    title: "Login Gagal",
                    description: "Email atau Password tidak sesuai",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                });
                setIsSubmitting(false);
            }
        }
    }

    return (
        <>
            <LayoutComponent metaTitle={'Login'}>
                <div 
                    className="flex h-screen w-full items-center justify-center bg-gray-900 bg-japan"
                >
                    <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
                        {
                            isSubmitting ? (
                                <div>
                                    {
                                        successLogin ? (
                                            <div className='flex justify-center items-center'>
                                                <Spinner size='xl' color='green.500' thickness='6px'/> <h5 className='text-white text-xl ml-2'>Redirecting...</h5>
                                            </div>
                                        ) : (
                                            <div className='flex justify-center items-center'>
                                                <Spinner size='xl' color='red.500' thickness='6px'/> <h5 className='text-white text-xl ml-2'>Loading...</h5>
                                            </div>
                                        )
                                    }
                                </div>
                            ) : (
                                <div>
                                    <div className="text-white">
                                        <div className="mb-8 flex flex-col items-center">
                                            <img src="https://i.ibb.co.com/QdX6yxy/japan-gapura.png" alt="app-logo" width="150"/>
                                            <h1 className="mb-2 text-2xl">Kenshusei Forum</h1>
                                            <span className="text-gray-300">Sign in to enter app</span>
                                        </div>

                                        <div className="mb-4 text-lg">
                                            <FormControl>
                                                <Input 
                                                    type='email' 
                                                    className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-inherit placeholder-slate-50 shadow-lg outline-none backdrop-blur-md" 
                                                    placeholder="Email..." 
                                                    style={{ width: '300px' }}
                                                    value={payload?.email}
                                                    onChange={(event) => setPayload({ ...payload, email: event.target.value })}
                                                />
                                            </FormControl>
                                        </div>

                                        <div className="mb-4 text-lg">
                                            <FormControl>
                                                <InputGroup size='md'>
                                                    <Input
                                                        type={showPw ? 'text' : 'password'}
                                                        className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-inherit placeholder-slate-50 shadow-lg outline-none backdrop-blur-md"
                                                        placeholder="Password..."
                                                        style={{ width: '300px' }}
                                                        value={payload?.password}
                                                        onChange={(event) => setPayload({ ...payload, password: event.target.value })}
                                                    />
                                                    <InputRightElement width='4.5rem'>
                                                        <Button h='1.75rem' size='sm' onClick={handlePassword} className='bg-transparent'>
                                                            {showPw ? <ViewOffIcon/> : <ViewIcon/>}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                            </FormControl>
                                        </div>

                                        <div className="mt-8 flex justify-center text-lg text-black">
                                            <button 
                                                onClick={() => HandleSubmit()} 
                                                className={`rounded-3xl bg-yellow-400 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600`}
                                                disabled={isSubmitting}
                                            >
                                                Login
                                            </button>
                                        </div>

                                        <div className='mt-4'>
                                            <div className='justify-center flex'>
                                                <p className='mr-2'>Don't have an account?</p> <Link href={'/register'} className='hover:text-blue-400 hover:scale-105'>Register</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </LayoutComponent>
        </>
    )
}
