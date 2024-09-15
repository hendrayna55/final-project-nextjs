import { Spinner } from '@chakra-ui/react';

export default function Loading() {
  return (
    <>
        <div
            className="bg-gray-800 bg-opacity-80 rounded-lg shadow-md p-4 flex justify-center items-center"
        >
            <Spinner
                color={'white'}
                size='lg'
                thickness='4px'
                className='mr-3'
            />
            <p className='font-bold text-white text-lg'>Please wait...</p>
        </div>
    </>
  )
}
