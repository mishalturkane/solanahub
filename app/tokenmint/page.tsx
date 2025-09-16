"use client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(9);
  const [supply, setSupply] = useState("");
  const [uri, setUri] = useState("");

  function handleMint() {
    // 🔥 You’ll add Metaplex mint logic here
    alert(
      `Would mint token:\nName: ${name}\nSymbol: ${symbol}\nDecimals: ${decimals}\nSupply: ${supply}\nURI: ${uri}`
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060606] to-[#0f0f0f] p-4">
      <div className="w-full max-w-lg p-6 rounded-2xl shadow-lg bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white">
        <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
          Mint New Token
        </h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Token Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195]"
        />

        {/* Symbol */}
        <input
          type="text"
          placeholder="Token Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195]"
        />

        {/* Decimals */}
        <input
          type="number"
          placeholder="Decimals (e.g., 9)"
          value={decimals}
          onChange={(e) => setDecimals(Number(e.target.value))}
          className="w-full p-3 mb-4 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195]"
        />

        {/* Supply */}
        <input
          type="number"
          placeholder="Initial Supply"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195]"
        />

        {/* URI */}
        <input
          type="text"
          placeholder="Metadata URI (IPFS/Arweave)"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195]"
        />

        {/* Mint Button */}
        <button
          onClick={handleMint}
          className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90"
        >
          Mint Token
        </button>
      </div>
    </div>
  );
}
