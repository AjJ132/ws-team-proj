import React from 'react';

interface PageHeaderProps {
    text: string;
    mode: 'small' | 'medium' | 'large';
    children: React.ReactNode;
    button? : React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
    text,
    mode,
    button,
    children
}) => {
    const widthClass = mode === 'small' ? 'max-w-[1200px]' : mode === 'medium' ? 'max-w-[1600px]' : 'w-full';

    return (
       <div>
            <div className='w-full h-24 lg:h-32 shadow-sm border-b '>
                <div className={`
                        mx-auto text-start flex items-center justify-between w-full h-full
                        ${widthClass}
                    `}>
                    <h1 className={`
                            text-white text-3xl lg:text-4xl font-medium
                            ${mode === 'small' ? '' : mode === 'medium' ? '' : 'pl-8'}
                        `} >
                        {text}
                    </h1>
                    {button && (
                        <div className='hidden lg:flex'>
                            {button}
                        </div>
                    )}
                    
                </div>


                
            </div>
            <div className={`mx-auto ${widthClass} pt-4`}>
                {children}
            </div>
            <div className='h-8 bg-background border-t mt-16' />
       </div>

    );
};

export default PageHeader;