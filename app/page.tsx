"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#060606] via-[#0a0a0a] to-[#141414] text-white relative overflow-hidden">
      {/* Animated Gradient Blobs */}
      <motion.div
        className="absolute -top-32 -left-32 w-72 h-72 bg-[#9945FF] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-40 -right-32 w-72 h-72 bg-[#14F195] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <main className="z-10 text-center px-6">
        {/* Devnet Badge */}
        <motion.div
          className="inline-block px-4 py-1 mb-4 text-sm rounded-full bg-[#1a1a1a] border border-[#14F195]/40 text-[#14F195] font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🟢 Currently on Devnet
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-white">Your Solana Hub</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          A one-stop dApp to send, receive, and manage SOL on-chain.  
          Powered by <span className="text-[#14F195] font-semibold">Solana</span>.
        </motion.p>

        {/* Contribution + Credits */}
        <motion.div
          className="flex flex-col gap-3 items-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p>
            Wanna contribute? 👉{" "}
            <Link
              href="https://github.com/mishalturkane/solanahub"
              target="_blank"
              className="hover:underline border font-medium rounded-br-md rounded-tl-md px-4 py-2 bg-white text-black"
            >
              GitHub Repository
            </Link>
          </p>
          <p className="mt-4">
            Developed by 👨🏻‍💻{" "}
            <Link
              href="https://www.mishalturkane.xyz"
              target="_blank"
              className="hover:underline mt-4 border rounded-br-md rounded-tl-md px-4 font-medium py-2 text-white bg-[#171717]"
            >
              Mishal Turkane
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-500 text-sm">
        Made with ❤️ on{" "}
        <span className="text-[#14F195]">Solana Blockchain</span>
      </footer>
    </div>
  );
}
