import { FaHeart, FaRegHeart, FaCommentDots, FaEllipsisH } from 'react-icons/fa';
import { usePost } from '@/contexts/PostContext';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import Link from 'next/link';

const PostCard = ({ item }) => {
    const { handleLike, handleUnlike, openModal, HandleDelete } = usePost();
    const isEdited = new Date(item.created_at).getTime() !== new Date(item.updated_at).getTime();

    return (
        <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-md p-4 text-white relative">
            <div className="flex items-start">
                {/* Avatar and Initials */}
                <div className="rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-3"
                     style={{ backgroundColor: 'hsl(210, 70%, 50%)' }}>
                    {item.user.name[0]}
                </div>
                <div className="flex-grow">
                    {/* Link to user profile */}
                    <Link href={item.is_own_post ? `/profile` : `/profile/${item.user.id}`}>
                        <h2 className="font-semibold">{item.user.name} {item.is_own_post && "(You)"}</h2>
                    </Link>

                    {/* Post Date */}
                    <p className="text-sm text-white">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {isEdited && <span className="ml-2 text-xs text-black bg-white px-1 rounded">Edited</span>}
                    </p>

                    {/* Post Description */}
                    <p className="mt-2">{item.description}</p>

                    {/* Like and Comment Buttons */}
                    <div className="flex items-center mt-2 space-x-4">
                        {/* Like Button */}
                        <button
                            onClick={item.is_like_post ? () => handleUnlike(item.id) : () => handleLike(item.id)}
                            className={`flex items-center ${item.is_like_post ? 'text-red-500' : 'text-white'} focus:outline-none`}
                        >
                            {item.is_like_post ? <FaHeart className="w-5 h-5 mr-1" /> : <FaRegHeart className="w-5 h-5 mr-1" />}
                            <span>{item.likes_count}</span>
                        </button>

                        {/* Comment Button */}
                        <button onClick={() => openModal(item.id)} className="flex items-center text-white focus:outline-none">
                            <FaCommentDots className="w-5 h-5 mr-1" />
                            <span>{item.replies_count}</span>
                        </button>
                    </div>
                </div>

                {/* Edit/Delete Menu for Own Post */}
                {item.is_own_post && (
                    <Menu>
                        <MenuButton color={'gray.100'}>
                            <FaEllipsisH />
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => openModal(item.id)}>Edit</MenuItem>
                            <MenuItem color={'red'} onClick={() => HandleDelete(item.id)}>Delete</MenuItem>
                        </MenuList>
                    </Menu>
                )}
            </div>
        </div>
    );
};

export default PostCard;
