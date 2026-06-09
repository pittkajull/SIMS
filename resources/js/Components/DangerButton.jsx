export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-[20px] border border-transparent bg-rose-500 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 active:scale-[0.98] ${
                    disabled && 'opacity-25 pointer-events-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
