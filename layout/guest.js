import Head from "next/head";

export default function LayoutGuest({ children, metaTitle, metaDescription }) {
  return (
    <div>
        <Head>
            <title>{`Kenshusei Forum - ${metaTitle || 'Apps'}`}</title>
            <meta name='description' content={metaDescription || 'Aplikasi Forum Kenshusei Japan'} />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel='icon' href='/japan-gapura.png'/>
        </Head>

        <div className="flex flex-col min-h-screen bg-japan">
            <div className="flex-grow flex flex-col justify-between">
                {children}
            </div>
        </div>
    </div>
  )
}
