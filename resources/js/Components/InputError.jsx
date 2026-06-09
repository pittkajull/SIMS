export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-rose-500 text-[10px] uppercase tracking-wider font-bold ' + className}
        >
            {message}
        </p>
    ) : null;
}
