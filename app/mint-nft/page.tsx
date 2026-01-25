// app/mint-nft/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import type { SignerWalletAdapter } from "@solana/wallet-adapter-base";
import Image from "next/image";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

const PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwNjZlMWQxZi0xYjM4LTQ3MDEtYjlkMS04MTYyNmFhODI1NzIiLCJlbWFpbCI6Im1pc2hhbHR1cmthbmVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjZjZTJmNzUxODVjM2RiYWVhZGNlIiwic2NvcGVkS2V5U2VjcmV0IjoiOWM1NTY1YWRkYTYyYjA1ZGI5NDU5M2YwZDkzZDU5NDUxZjQ5MDk5YTA1MzE3NzJkY2RjZWJlZWU2MjlhYTM4NiIsImV4cCI6MTgwMDY5MTQxM30.227vxvWrFh2kp0SL8gIyeJ-6UsUakh3b0_WoBcbE5Zk";

const PINATA_GATEWAY = "https://gold-permanent-camel-422.mypinata.cloud";

// IDL
const IDL = {
  address: "ZCd5FXTknjtfCUvwAsJb8bTYY2BLXhQdQ3cd8cET3rU",
  metadata: {
    name: "nft_minter",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "mint_nft",
      discriminator: [211, 57, 6, 167, 15, 219, 35, 251],
      accounts: [
        { name: "payer", writable: true, signer: true },
        { name: "metadata_account", writable: true },
        { name: "edition_account", writable: true },
        { name: "mint_account", writable: true, signer: true },
        { name: "associated_token_account", writable: true },
        { name: "token_program" },
        { name: "token_metadata_program" },
        { name: "associated_token_program" },
        { name: "system_program" },
        { name: "rent" },
      ],
      args: [
        { name: "nft_name", type: "string" },
        { name: "nft_symbol", type: "string" },
        { name: "nft_uri", type: "string" },
      ],
    },
  ],
};

async function uploadToPinata(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("pinataMetadata", JSON.stringify({ name: file.name }));

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${PINATA_JWT}` },
      body: formData,
    },
  );

  if (!response.ok) throw new Error("Upload failed");
  const data = await response.json();
  return data.IpfsHash;
}

export default function MintNFTPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();

  const [nftName, setNftName] = useState("");
  const [nftSymbol, setNftSymbol] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [result, setResult] = useState<{
    mintAddress: string;
    signature: string;
    metadataUri: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const mintNFT = useCallback(async () => {
    if (!publicKey || !wallet?.adapter) {
      setError("Please connect your wallet");
      return;
    }

    if (!nftName || !nftSymbol || !imageFile) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Step 1: Upload image
      setCurrentStep("Uploading image to IPFS...");
      const imageCID = await uploadToPinata(imageFile);
      const imageURI = `${PINATA_GATEWAY}/ipfs/${imageCID}`;

      // Step 2: Create and upload metadata
      setCurrentStep("Uploading metadata to IPFS...");
      const metadata = {
        name: nftName,
        symbol: nftSymbol,
        description: `${nftName} - NFT created with decentralized storage`,
        image: imageURI,
        attributes: [],
        properties: {
          files: [{ uri: imageURI, type: imageFile.type }],
          category: "image",
        },
      };

      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: "application/json",
      });
      const metadataFile = new File([metadataBlob], "metadata.json", {
        type: "application/json",
      });
      const metadataCID = await uploadToPinata(metadataFile);
      const metadataURI = `${PINATA_GATEWAY}/ipfs/${metadataCID}`;

      // Step 3: Mint NFT on Solana
      setCurrentStep("Minting NFT on Solana...");

      // Narrow the adapter type
      const signerAdapter = wallet.adapter as SignerWalletAdapter;

      // Anchor-compatible wallet
      const anchorWallet = {
        publicKey: signerAdapter.publicKey as PublicKey,
        signTransaction: signerAdapter.signTransaction.bind(signerAdapter),
        signAllTransactions:
          signerAdapter.signAllTransactions.bind(signerAdapter),
      };

      const provider = new AnchorProvider(connection, anchorWallet, {
        commitment: "confirmed",
      });

      const program = new Program(IDL as any, provider);

      // Generate mint keypair
      const mintKeypair = Keypair.generate();

      // Derive PDAs
      const [metadataAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID,
      );

      const [editionAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID,
      );

      const associatedTokenAddress = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        publicKey,
      );

      // Build instruction
      const instruction = await program.methods
        .mintNft(nftName, nftSymbol, metadataURI)
        .accounts({
          payer: publicKey,
          metadataAccount: metadataAccount,
          editionAccount: editionAccount,
          mintAccount: mintKeypair.publicKey,
          associatedTokenAccount: associatedTokenAddress,
          tokenProgram: TOKEN_PROGRAM_ID,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .instruction();

      // Create transaction
      const transaction = new Transaction().add(instruction);
      transaction.feePayer = publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // Sign with mint keypair
      transaction.partialSign(mintKeypair);

      // Send transaction
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      // Confirm transaction
      await connection.confirmTransaction(signature, "confirmed");

      setResult({
        mintAddress: mintKeypair.publicKey.toBase58(),
        signature: signature,
        metadataUri: metadataURI,
      });

      setCurrentStep("NFT minted successfully! 🎉");
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to mint NFT");
    } finally {
      setLoading(false);
    }
  }, [
    publicKey,
    wallet,
    connection,
    nftName,
    nftSymbol,
    imageFile,
    sendTransaction,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060606] to-[#0f0f0f] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white">
          <div className="text-center mb-6 border-b-2 border-[#333] pb-5">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
              NFT MINTER
            </h1>
            <p className="text-gray-400 text-base">
              Upload & Mint Your NFT on Solana
            </p>
          </div>

          {!publicKey ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">
                First Connect your wallet to get started
              </p>
            </div>
          ) : (
            <>
              {/* NFT Name */}
              <div className="mb-4">
                <label className="block mb-2 text-white font-semibold text-sm">
                  NFT NAME
                </label>
                <input
                  type="text"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  placeholder="Enter NFT name"
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195] disabled:opacity-50"
                />
              </div>

              {/* Symbol */}
              <div className="mb-4">
                <label className="block mb-2 text-white font-semibold text-sm">
                  SYMBOL
                </label>
                <input
                  type="text"
                  value={nftSymbol}
                  onChange={(e) => setNftSymbol(e.target.value)}
                  placeholder="Enter symbol"
                  maxLength={10}
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195] disabled:opacity-50"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block mb-2 text-white font-semibold text-sm">
                  IMAGE FILE
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageFile"
                    className={`flex items-center justify-center p-12 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                      imagePreview
                        ? "bg-gradient-to-r from-[#14F195]/10 to-[#9945FF]/10 border-[#14F195]"
                        : "bg-[#141414] border-[#333] hover:border-[#14F195]"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {imagePreview ? (
                      <div className="relative h-[200px] w-full">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="rounded-lg object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <div className="text-5xl mb-4">⬆</div>
                        <div>
                          <strong>CLICK TO UPLOAD</strong>
                        </div>
                        <div className="text-sm mt-2 opacity-70">
                          PNG, JPG, GIF
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Mint Button */}
              <button
                onClick={mintNFT}
                disabled={loading || !nftName || !nftSymbol || !imageFile}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "PROCESSING..." : "MINT NFT"}
              </button>

              {/* Loading State */}
              {loading && (
                <div className="mt-6 text-center p-6 rounded-lg bg-[#141414] border border-[#333]">
                  <div className="border-4 border-t-[#14F195] border-r-transparent border-b-transparent border-l-transparent rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-semibold">{currentStep}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400 text-sm">
                  ✕ {error}
                </div>
              )}

              {/* Success Result */}
              {result && (
                <div className="mt-6 p-6 rounded-lg bg-[#141414] border border-[#333]">
                  <h3 className="text-white mb-6 text-xl font-bold">
                    ✓ SUCCESS
                  </h3>

                  <div className="mb-5 break-all">
                    <span className="font-semibold text-gray-400 block mb-2 text-xs uppercase">
                      MINT ADDRESS
                    </span>
                    <span className="text-white text-sm bg-[#0a0a0a] p-3 rounded border border-[#333] block font-mono">
                      {result.mintAddress}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(result.mintAddress)
                      }
                      className="mt-2 px-4 py-2 text-xs font-semibold rounded bg-[#0a0a0a] text-white border border-[#333] hover:border-[#14F195] transition-all"
                    >
                      COPY
                    </button>
                  </div>

                  <div className="mb-5">
                    <span className="font-semibold text-gray-400 block mb-2 text-xs uppercase">
                      TRANSACTION
                    </span>
                    <a
                      href={`https://orbmarkets.io/tx/${result.signature}?cluster=devnet&tab=summary`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#14F195] hover:text-[#9945FF] underline font-semibold transition-colors"
                    >
                      View on ORB Explorer →
                    </a>
                  </div>

                  <div className="mb-0">
                    <span className="font-semibold text-gray-400 block mb-2 text-xs uppercase">
                      METADATA URI
                    </span>
                    <a
                      href={result.metadataUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#14F195] hover:text-[#9945FF] underline font-semibold transition-colors"
                    >
                      View Metadata →
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
