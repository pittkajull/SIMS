export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-[10px] font-bold text-slate-500 uppercase tracking-widest ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
