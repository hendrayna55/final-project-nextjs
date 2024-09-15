import { FaHeart, FaRegHeart, FaCommentDots, FaEllipsisH } from 'react-icons/fa';
import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';

export default function PostCard({ id, name, time, content, likes, comments, onEdit }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [commentCount, setCommentCount] = useState(comments);

    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 50%)`;
        return color;
    };

    const handleLike = async (id) => {
        console.log("Berhasil");
        
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    };

    const handleComment = () => {
        // Handle comments jika diperlukan
    };

    const getInitials = (name) => {
        const names = name.split(' ');
        return names.map((n) => n[0]).join('').toUpperCase();
    };

    return (
        <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-md p-4 text-white relative">
            <div className="flex items-start">
                {/* Avatar with Initials */}
                <div
                    className="rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-3"
                    style={{ backgroundColor: stringToColor(name) }}
                >
                    {getInitials(name)}
                </div>

                <div className="flex-grow">
                    <h2 className="font-semibold">{name}</h2>
                    <p className="text-sm text-white">{time}</p>
                    <p className="mt-2">{content}</p>
                    <div className="flex items-center mt-2 space-x-4">
                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            className={`flex items-center ${isLiked ? 'text-red-500' : 'text-white'} focus:outline-none`}
                        >
                            {isLiked ? <FaHeart className="w-5 h-5 mr-1" /> : <FaRegHeart className="w-5 h-5 mr-1" />}
                            <span className='text-white'>{likeCount}</span>
                        </button>

                        {/* Comment Count */}
                        <button onClick={handleComment} className="flex items-center text-white focus:outline-none">
                            <FaCommentDots className="w-5 h-5 mr-1" />
                            <span className='text-white'>{commentCount}</span>
                        </button>
                    </div>
                </div>

                {/* Titik Tiga (Menu Opsi) */}
                <Button colorScheme={'ghost'} color={'gray.100'} onClick={() => onEdit({ id, description: content })}>
                    <FaEllipsisH /> {/* Hanya tampilan ikon, event handler dipindahkan ke Button */}
                </Button>
            </div>
        </div>
    );
}
