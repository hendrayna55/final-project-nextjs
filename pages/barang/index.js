import dynamic from "next/dynamic";
const LayoutComponent = dynamic(() => import('@/layout/index'));

export default function Barang() {
    return (
        <LayoutComponent metaTitle={'Barang'} metaDescription={'ini adalah halaman barang'}>
            <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-md p-4 flex text-white">
                Barang kudacuki
            </div>
        </LayoutComponent>
    )
}
