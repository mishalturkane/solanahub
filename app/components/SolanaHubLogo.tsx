import Link from "next/link";

export default function SolanaHubLogo() {
  return (
    <div className="bg-[#171717]  px-4  py-2 inline-flex items-center rounded">
      <Link href="/" className="flex items-center">
        {/* "Solana" part */}
        <span className="text-white font-extrabold text-2xl tracking-tight">
          Solana
        </span>

        {/* "HUB" pill */}
        <span className="ml-2 bg-yellow-400 text-black font-extrabold text-2xl px-3 py-1 rounded">
          HUB
        </span>
      </Link>
    </div>
  );
}
