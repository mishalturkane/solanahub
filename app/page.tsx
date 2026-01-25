"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Shield, Coins, Image, ArrowRightLeft, History } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Airdrop",
      description: "Request testnet SOL instantly for development and testing purposes"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Balance Check",
      description: "Monitor your SOL balance in real-time with accurate on-chain data"
    },
    {
      icon: <ArrowRightLeft className="w-6 h-6" />,
      title: "Send SOL",
      description: "Transfer SOL securely to any wallet address on the network"
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Mint Tokens",
      description: "Create custom SPL tokens with metadata and distribution controls"
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Mint NFTs",
      description: "Launch unique digital assets with full metadata support"
    },
    {
      icon: <History className="w-6 h-6" />,
      title: "Transactions",
      description: "Track and view your complete transaction history on-chain"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#0a0a0a] to-[#141414] text-white relative overflow-hidden">
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
      <motion.div
        className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#9945FF] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ x: [-50, 50, -50], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Content */}
      <main className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          {/* Devnet Badge */}
          <motion.div
            className="inline-block px-4 py-1 mb-6 text-sm rounded-full bg-[#1a1a1a] border border-[#14F195]/40 text-[#14F195] font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            🟢 Currently on Devnet
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-[#14F195] via-[#9945FF] to-[#14F195] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Solana Hub
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Your all-in-one platform for Solana blockchain interactions. 
            Send, receive, create tokens, mint NFTs, and manage your digital assets with ease.
          </motion.p>

          <motion.p
            className="text-base text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Built for developers and creators on the fastest blockchain ecosystem. 
            Experience lightning-fast transactions and minimal fees.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#14F195]/50 transition-all duration-300 group hover:shadow-lg hover:shadow-[#14F195]/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-[#14F195] mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div
          className="bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
            Built With Modern Tech
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <p className="text-[#14F195] font-semibold text-lg">Solana Web3.js</p>
              <p className="text-gray-400 text-sm mt-1">Blockchain Integration</p>
            </div>
            <div className="p-4">
              <p className="text-[#9945FF] font-semibold text-lg">Next.js 14</p>
              <p className="text-gray-400 text-sm mt-1">React Framework</p>
            </div>
            <div className="p-4">
              <p className="text-[#14F195] font-semibold text-lg">Wallet Adapter</p>
              <p className="text-gray-400 text-sm mt-1">Seamless Connection</p>
            </div>
            <div className="p-4">
              <p className="text-[#9945FF] font-semibold text-lg">TypeScript</p>
              <p className="text-gray-400 text-sm mt-1">Type Safety</p>
            </div>
          </div>
        </motion.div>

        {/* Why Solana Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
            Why Choose Solana?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-5xl font-bold text-[#14F195] mb-3">65,000+</div>
              <p className="text-lg font-semibold text-white mb-2">Transactions Per Second</p>
              <p className="text-gray-400 text-sm">Lightning-fast transaction processing for seamless user experience</p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-5xl font-bold text-[#9945FF] mb-3">&lt;$0.01</div>
              <p className="text-lg font-semibold text-white mb-2">Average Transaction Fee</p>
              <p className="text-gray-400 text-sm">Minimal costs make blockchain accessible to everyone</p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-5xl font-bold text-[#14F195] mb-3">400ms</div>
              <p className="text-lg font-semibold text-white mb-2">Block Time</p>
              <p className="text-gray-400 text-sm">Near-instant finality for real-time applications</p>
            </div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#14F195] to-[#00D084] rounded-full flex items-center justify-center text-black font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400">
                  Use any Solana-compatible wallet like Phantom, Solflare, or Backpack. Click the &quot;Connect Wallet&quot; button in the navigation bar to get started.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#9945FF] to-[#7d3acc] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Request Devnet SOL</h3>
                <p className="text-gray-400">
                  Visit the airdrop page to receive free testnet SOL. This allows you to experiment with all features without spending real money.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#14F195] to-[#00D084] rounded-full flex items-center justify-center text-black font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Explore Features</h3>
                <p className="text-gray-400">
                  Send SOL to friends, create your own tokens, mint NFTs, and track all your transactions in real-time. Everything you need in one place.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#9945FF] to-[#7d3acc] rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Build & Create</h3>
                <p className="text-gray-400">
                  Launch your own digital assets, experiment with token economics, and learn blockchain development in a safe testnet environment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.75, duration: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
            Perfect For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#14F195]/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#14F195] mb-3">🎓 Developers</h3>
              <p className="text-gray-400 leading-relaxed">
                Learn Solana development with hands-on experience. Test smart contracts, experiment with token standards, and build your blockchain portfolio without financial risk.
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#9945FF]/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#9945FF] mb-3">🎨 Creators</h3>
              <p className="text-gray-400 leading-relaxed">
                Mint NFTs and create custom tokens for your community. Perfect for artists, musicians, and content creators exploring Web3 monetization.
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#14F195]/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#14F195] mb-3">🚀 Entrepreneurs</h3>
              <p className="text-gray-400 leading-relaxed">
                Prototype token-based business models and test blockchain integration before launching on mainnet. Validate ideas quickly and affordably.
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#9945FF]/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#9945FF] mb-3">📚 Students</h3>
              <p className="text-gray-400 leading-relaxed">
                Educational playground for learning blockchain concepts, cryptography, and decentralized applications. Build your first dApp with guided tools.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Link
              href="/airdrop"
              className="bg-gradient-to-r from-[#14F195] to-[#00D084] hover:from-[#00D084] hover:to-[#14F195] text-black font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#14F195]/20"
            >
              Get Started →
            </Link>
            <Link
              href="https://github.com/mishalturkane/solanahub"
              target="_blank"
              className="border border-gray-700 hover:border-[#9945FF] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              View on GitHub
            </Link>
          </div>

          <p className="text-gray-400 text-sm mb-8">
            Open source and community-driven • Connect your wallet to get started
          </p>

          {/* Credits */}
          <div className="flex flex-col gap-3 items-center text-gray-400 text-sm">
            <p>
              Developed by{" "}
              <Link
                href="https://www.mishalturkane.xyz"
                target="_blank"
                className="text-[#14F195] hover:text-[#00D084] font-medium transition-colors duration-300"
              >
                Mishal Turkane
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-gray-500 text-sm">
        Made with ❤️ on{" "}
        <span className="text-[#14F195] font-medium">Solana Blockchain</span>
      </footer>
    </div>
  );
}