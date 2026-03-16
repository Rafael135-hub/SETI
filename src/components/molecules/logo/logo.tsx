export default function Logo() {

    const year: number = new Date().getFullYear();

  return (
    <div className="flex flex-col items-end gap-2">
      <img src="/images/logo-seti.png" alt="SETI Logo" className="w-24 max-h-full" />
      <span className="text-sm text-white font-orbitron">{year}</span>
    </div>
  );
}