'use client';

interface NavButtonProps {
    color: 'green' | 'yellow' | 'blue' | 'purple' | 'orange';
    icon: string;
    text: string;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
}

const colorMap = {
    green: {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600',
        active: 'bg-green-700'
    },
    yellow: {
        bg: 'bg-yellow-500',
        hover: 'hover:bg-yellow-600',
        active: 'bg-yellow-700'
    },
    blue: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        active: 'bg-blue-700'
    },
    purple: {
        bg: 'bg-purple-500',
        hover: 'hover:bg-purple-600',
        active: 'bg-purple-700'
    },
    orange: {
        bg: 'bg-orange-500',
        hover: 'hover:bg-orange-600',
        active: 'bg-orange-700'
    }
};

export default function NavButton(
    {
        color,
        icon,
        text,
        onClick,
        active = false,
        disabled = false
    }: NavButtonProps) {
    const colors = colorMap[color];

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'text-white p-6 rounded-lg shadow-md transition-colors flex flex-col items-center',
                colors.bg,
                !active && !disabled && colors.hover,
                active && colors.active,
                disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-current={active ? 'page' : undefined}
        >
            <svg
                className="w-10 h-10 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={icon}
                />
            </svg>
            <span className="font-medium">{text}</span>
        </button>
    );
}

function cn(...inputs: Array<string | boolean | undefined | null>) {
    return inputs
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}