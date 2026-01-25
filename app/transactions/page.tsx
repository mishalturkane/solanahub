// app/transaction/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.publicKey) {
      fetchTransactions(wallet.publicKey);
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [wallet.publicKey, connection]);

  const fetchTransactions = async (publicKey: PublicKey) => {
    setLoading(true);
    setError(null);
    try {
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 10,
      });

      if (signatures.length === 0) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      const transactionsData = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const transaction = await connection.getParsedTransaction(
              sig.signature,
              {
                maxSupportedTransactionVersion: 0,
              }
            );
            return {
              signature: sig.signature,
              timestamp: transaction?.blockTime ?? null,
              transaction,
            };
          } catch (err) {
            console.error(`Failed to fetch transaction ${sig.signature}:`, err);
            return {
              signature: sig.signature,
              timestamp: null,
              transaction: null,
            };
          }
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
    <div className="min-h-screen bg-gradient-to-br from-[#060606] to-[#0f0f0f] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
       

        {/* Content */}
        {!wallet.publicKey ? (
          <div className="text-center py-12 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-2xl shadow-lg">
            <p className="text-gray-400 text-lg mb-4">
              👆 Connect your wallet to view transaction history
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-12 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-2xl shadow-lg">
            <div className="border-4 border-t-[#14F195] border-r-transparent border-b-transparent border-l-transparent rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
            <p className="text-white font-semibold">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400">
            ✕ {error}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-2xl shadow-lg">
            <p className="text-gray-400 text-lg">No transactions found for this wallet.</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-2xl shadow-lg overflow-hidden">
            {/* Desktop Table */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-[#14F195]/20 to-[#9945FF]/20 border-b border-[#333]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Signature
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#141414]"
                      } border-b border-[#333] hover:bg-[#1a1a1a] transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-300 break-all">
                          {tx.signature.slice(0, 20)}...{tx.signature.slice(-20)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {tx.timestamp
                          ? new Date(tx.timestamp * 1000).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`https://orbmarkets.io/tx/${tx.signature}?cluster=devnet&tab=summary`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#14F195] hover:text-[#9945FF] font-semibold transition-colors"
                        >
                          View on ORB →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-4 p-4 md:hidden">
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className="bg-[#141414] border border-[#333] p-4 rounded-lg shadow-md hover:shadow-lg hover:border-[#14F195] transition-all"
                >
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-400 mb-1 uppercase">
                      Signature
                    </p>
                    <p className="font-mono text-sm text-white break-all">
                      {tx.signature}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-400 mb-1 uppercase">
                      Timestamp
                    </p>
                    <p className="text-sm text-white">
                      {tx.timestamp
                        ? new Date(tx.timestamp * 1000).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  <a
                    href={`https://orbmarkets.io/tx/${tx.signature}?cluster=devnet&tab=summary`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#14F195] hover:text-[#9945FF] font-semibold transition-colors"
                  >
                    View on ORB Explorer →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;