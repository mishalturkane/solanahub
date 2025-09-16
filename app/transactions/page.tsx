// app/transaction/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js";

interface TransactionData {
  signature: string;
  timestamp?: number | null;
  transaction?: ParsedTransactionWithMeta | null;
}

const TransactionPage: React.FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.publicKey) {
      fetchTransactions(wallet.publicKey);
    }
  }, [wallet.publicKey]);

  const fetchTransactions = async (publicKey: PublicKey) => {
    setLoading(true);
    setError(null);
    try {
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
      const transactionsData = await Promise.all(
        signatures.map(async (sig) => {
          const transaction = await connection.getParsedTransaction(sig.signature);
          return {
            signature: sig.signature,
            timestamp: transaction?.blockTime ?? null,
            transaction,
          };
        })
      );
      setTransactions(transactionsData);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-[#9945FF] mb-4">Transaction History</h1>

      {loading ? (
        <p className="text-[#14F195]">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full border border-[#14F195] text-left hidden md:table">
            <thead className="bg-[#9945FF] text-white">
              <tr>
                <th className="px-4 py-2 border border-[#14F195]">Signature</th>
                <th className="px-4 py-2 border border-[#14F195]">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-black" : "bg-[#171717]"
                  } text-gray-200 hover:bg-gray-700 transition-colors`}
                >
                  <td className="px-4 py-2 border border-[#14F195]">
                    <a
                      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {tx.signature}
                    </a>
                  </td>
                  <td className="px-4 py-2 border border-[#14F195]">
                    {tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-4 md:hidden">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className="bg-black text-[#14F195] border border-[#14F195] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <p className="font-semibold text-[#9945FF]">Signature:</p>
                <a
                  href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline break-all"
                >
                  {tx.signature}
                </a>
                <p className="mt-2 font-semibold text-[#9945FF]">Timestamp:</p>
                <p>{tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleString() : "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
