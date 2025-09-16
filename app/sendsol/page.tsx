"use client";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export default function Home() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [txSig, setTxSig] = useState<string | null>(null);

  async function sendTokens() {
    if (!wallet.publicKey) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setLoading(true);

      const toPubkey = new PublicKey(to);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      if (isNaN(lamports) || lamports <= 0) {
        alert("Enter a valid amount");
        setLoading(false);
        return;
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey,
          lamports,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");

      setTxSig(signature);
      setTo("");
      setAmount("");
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("❌ Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060606] to-[#0f0f0f] p-4 relative">
      {/* Form */}
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white">
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
          Send SOL
        </h2>

        <input
          type="text"
          placeholder="Recipient Address"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full p-3 mb-3 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
        />

        <input
          type="number"
          placeholder="Amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195]"
        />

        <button
          onClick={sendTokens}
          disabled={!wallet.connected || loading}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            wallet.connected
              ? "bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Toast Notification */}
      {txSig && (
        <div className="fixed bottom-4 right-4 bg-[#141414] border border-[#333] rounded-xl shadow-lg p-4 w-80 text-white animate-slide-in">
          <h3 className="text-lg font-semibold text-[#14F195]">
            ✅ Transaction Successful
          </h3>
          <p className="text-sm text-gray-400 mb-2 break-all">{txSig}</p>
          <div className="flex space-x-3 text-sm">
            <a
              href={`https://solscan.io/tx/${txSig}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#14F195] hover:underline"
            >
              View on Solscan
            </a>
            <a
              href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9945FF] hover:underline"
            >
              View on Explorer
            </a>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
     
    </div>
  );
}
