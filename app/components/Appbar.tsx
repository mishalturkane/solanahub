"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // npm install lucide-react
import { WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import SolanaHubLogo from "./SolanaHubLogo";


export default function AppBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <SolanaHubLogo/>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 font-medium">
            <Link href="/airdrop" className="hover:text-purple-400">airdrop</Link>
            <Link href="/solbalance" className="hover:text-purple-400">sol balance</Link>
            <Link href="/sendsol" className="hover:text-purple-400">send sol</Link>
            <Link href="/mint-token" className="hover:text-purple-400">mint token</Link>
            <Link href="/mint-nft" className="hover:text-purple-400">mint nft</Link>
            <Link href="/transactions" className="hover:text-purple-400">transactions</Link>
          </div>

            
            {/*wallet connector */}
            <WalletMultiButton/>


          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 px-4 pb-3 space-y-2">
          <Link href="#launch-token" className="block hover:text-purple-400">Launch Token</Link>
          <Link href="#metadata-token" className="block hover:text-purple-400">Metadata Token</Link>
          <Link href="#normal-token" className="block hover:text-purple-400">Normal Token</Link>
          <button className="w-full bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-semibold transition">
            Connect Wallet
          </button>
        </div>
      )}
    </nav>
  );
}
