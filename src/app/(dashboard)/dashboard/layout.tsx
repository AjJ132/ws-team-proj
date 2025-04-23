
import CreateExtensionModal from '@/components/extensions/create-extensions-modal'
import PageHeader from '@/components/layout/page-header'
import { Metadata } from 'next'
import React from 'react'


//metadata
export const metadata: Metadata = {
    title: "Dashboard",
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const createNewExtensionButton = (
        <CreateExtensionModal  /> // Pass an empty array for tags if not needed
    )
    return (
        <>
            <div className='w-full min-h-screen flex flex-col gap-0 bg-background2 overflow-y-auto'>
               <PageHeader text='Extensions' mode='small'
                button={createNewExtensionButton}
               >
                    {children}
                </PageHeader>
            </div>
        </>
    )
}

export default Layout