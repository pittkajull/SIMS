export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-slate-300 bg-white text-emerald-500 shadow-sm focus:ring-emerald-500 focus:ring-offset-white focus:ring-2 transition-all cursor-pointer ' +
                className
            }
        />
    );
}
