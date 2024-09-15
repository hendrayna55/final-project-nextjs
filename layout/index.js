import { PostProvider, usePost } from '@/contexts/PostContext';
import Header from "@/components/header";
import SideBar from "@/components/sidebar";
import Head from "next/head";

const LayoutApp = ({ children, metaTitle, metaDescription }) => {
    const { openModal } = usePost(); // Mengambil openModal dari context

    return (
        <>
            <Head>
                <title>{`Kenshusei Forum - ${metaTitle || 'Apps'}`}</title>
                <meta name='description' content={metaDescription || 'Aplikasi Forum Kenshusei Japan'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel='icon' href='/japan-gapura.png' />
            </Head>

            <div className="flex flex-col min-h-screen">
                {/* Header */}
                <Header />

                {/* Sidebar di desktop */}
                <SideBar />

                <main className="flex-1 flex justify-center pb-16 mt-20 md:mt-0 z-0">
                    <div className="w-full max-w-md md:max-w-3xl p-4 space-y-4">
                        {children}
                    </div>
                </main>

                {/* Tombol melayang untuk membuka modal */}
                <button
                    className="hidden md:block fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
                    onClick={() => openModal()} // Akses openModal dari context
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>
        </>
    );
};

// Bungkus seluruh aplikasi dengan PostProvider
const LayoutWrapper = ({ children, metaTitle, metaDescription }) => {
    return (
        <PostProvider>
            <LayoutApp metaTitle={metaTitle} metaDescription={metaDescription}>
                {children}
            </LayoutApp>
        </PostProvider>
    );
};

export default LayoutWrapper;
