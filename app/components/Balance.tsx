"use client";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";

export function Balance() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchBalance() {
    if (!wallet.publicKey) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setLoading(true);
      const balanceLamports = await connection.getBalance(wallet.publicKey);
      setBalance(balanceLamports / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white text-center">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
        Check SOL Balance
      </h2>

      {/* Balance Display */}
      <div className="flex flex-col items-center mb-4">
        {loading ? (
          <div className="flex flex-col items-center">
            <Image
              src="/solana.png"
              alt="Solana"
              width={40}
              height={40}
              className="animate-spin-slow mb-2"
            />
            <p className="text-gray-400 text-sm">Fetching balance...</p>
          </div>
        ) : (
          <p className="text-xl font-semibold">
            {balance !== null ? `${balance.toFixed(2)} SOL` : "--"}
          </p>
        )}
      </div>

      {/* Button */}
      <button
        onClick={fetchBalance}
        disabled={!wallet.connected || loading}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
          wallet.connected
            ? "bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        {loading ? "Checking..." : "Check Balance"}
      </button>

      {/* Slow Spin Animation for Solana Logo */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
