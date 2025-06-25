import {ButtonHTMLAttributes, ReactNode} from 'react';

interface GreenButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export const GreenButton = (
    {children, onClick, ...props}: GreenButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors`}
            {...props}
        >
            {children}
        </button>
    );
};