import {
    FormControl,
    FormLabel,
    Input, useToast, Grid, GridItem,
    InputGroup,
    InputRightElement,
    Button, Spinner
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useMutation } from '@/hooks/useMutation';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LayoutComponent = dynamic(() => import('@/layout/guest'));

export default function Register() {
    const [ showPw, setShowPw ] = useState(false);
    const handlePassword = () => setShowPw(!showPw);
    const router = useRouter();
    const toast = useToast();
    const { mutate } = useMutation();
    const [payload, setPayload] = useState(
        {
            name: "",
            email: "",
            password: "",
            dob: "",
            phone: "",
            hobby: ""
        }
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const HandleSubmit = async () => {
        setIsSubmitting(true);

        if (payload.name == "" || payload.email == "" || payload.password == "") {
            toast({
                title: "Register Failed!",
                description: "Data required has null value!",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"
            });

            setIsSubmitting(false);
        } else {
            const response = await mutate(
                {
                    url: "https://service.pace-unv.cloud/api/register",
                    payload
                }
            );
    
            if (response?.success) {
                toast({
                    title: "Register Success!",
                    description: response?.message,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right"
                });

                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                toast({
                    title: "Register Failed!",
                    description: response?.message,
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
            <LayoutComponent metaTitle={'Register'}>
                <div 
                    className="flex h-screen items-center justify-center bg-gray-900 bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://r4.wallpaperflare.com/wallpaper/50/519/649/religious-pagoda-cherry-blossom-japan-wallpaper-4960a89df18afdbb16c768bf80c1661d.jpg')"
                    }}
                >
                    <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
                        {
                            isSubmitting ? (
                                <div className='flex justify-center items-center'>
                                    <Spinner size='xl' color='red.500' thickness='6px'/> <h5 className='text-white text-xl ml-2'>Loading...</h5>
                                </div>
                            ) : (
                                <div className="text-white">
                                    <div className="mb-8 flex flex-col items-center">
                                        <h1 className="mb-2 text-2xl">Register</h1>
                                        <span className="text-gray-300">Create your account here!</span>
                                    </div>

                                    <Grid templateColumns={'repeat(2, 1fr)'} gap={6}>
                                        <GridItem>
                                            <div className="mb-4 text-lg">
                                                <FormControl isRequired>
                                                    <FormLabel>Name</FormLabel>
                                                    <Input 
                                                        type='text' 
                                                        className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-inherit placeholder-slate-50 shadow-lg outline-none backdrop-blur-md" 
                                                        placeholder="Name..." 
                                                        style={{ width: '300px' }}
                                                        value={payload?.name}
                                                        onChange={(event) => setPayload({ ...payload, name: event.target.value })}
                                                    />
                                                </FormControl>
                                            </div>

                                            <div className="mb-4 text-lg">
                                                <FormControl>
                                                    <FormLabel>Date of Birth</FormLabel>
                                                    <Input 
                                                        type='date' 
                                                        className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-inherit placeholder-slate-50 shadow-lg outline-none backdrop-blur-md" 
                                                        placeholder="Date of Birth..." 
                                                        style={{ width: '300px' }}
                                                        value={payload?.dob}
                                                        onChange={(event) => setPayload({ ...payload, dob: event.target.value })}
                                                    />
                                                </FormControl>
                                            </div>

                                            <div className="mb-4 text-lg">
                                                <FormControl>
                                                    <FormLabel>Hobby</FormLabel>
                                                    <Input 
                                                        type='text' 
                                                        className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-inherit placeholder-slate-50 shadow-lg outline-none backdrop-blur-md" 
                                                        placeholder="Hobby..." 
                                                        style={{ width: '300px' }}
                                                        value={payload?.hobby}
                                                        onChange={(event) => setPayload({ ...payload, hobby: event.target.value })}
                                                    />
                                                </FormControl>
                                            </div>
                                        </GridItem>

                                        <GridItem>
                                            <div className="mb-4 text-lg">
                                                <FormControl>
                                                    <FormLabel>Phone</FormLabel>
                                                    <Input 
                                                        type='number' 
                                                        className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-inherit placeholder-slate-50 shadow-lg outline-none backdrop-blur-md" 
                                                        placeholder="08xxxxxxxxx..." 
                                                        style={{ width: '300px' }}
                                                        value={payload?.phone}
                                                        onChange={(event) => setPayload({ ...payload, phone: event.target.value })}
                                                    />
                                                </FormControl>
                                            </div>

                                            <div className="mb-4 text-lg">
                                                <FormControl isRequired>
                                                    <FormLabel>Email</FormLabel>
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
                                                <FormControl isRequired>
                                                    <FormLabel>Password</FormLabel>
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
                                        </GridItem>
                                    </Grid>

                                    <div className="mt-8 flex justify-center text-lg text-black">
                                        <button 
                                            onClick={() => HandleSubmit()} 
                                            className={`rounded-3xl bg-yellow-400 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600 ${isSubmitting ? "disabled:cursor-not-allowed" : ""}`}
                                            disabled={isSubmitting}
                                        >
                                            Register
                                        </button>
                                    </div>

                                    <div className='mt-4'>
                                        <div className='justify-center flex'>
                                            <p className='mr-2'>Already have an account?</p> <Link href={'/login'} className='hover:text-blue-400 hover:scale-105'>Login</Link>
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
