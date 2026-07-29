interface ProfileFormFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  type?: "text" | "email";
  onChange: (value: string) => void;
}

export default function ProfileFormField({
  label,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
}: ProfileFormFieldProps) {
  return (
    <label htmlFor={name} className="block">
      <span className="text-[15px] font-light text-white/92">{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-[42px] w-full border border-seti-purple-80/60 bg-transparent px-4 text-[13px] text-white placeholder:text-white/45 outline-none transition-colors focus:border-seti-purple-80"
      />
    </label>
  );
}
