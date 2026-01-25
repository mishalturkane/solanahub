// app/mint-token/page.tsx
"use client";
import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  createInitializeMint2Instruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import Image from "next/image";

const PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwNjZlMWQxZi0xYjM4LTQ3MDEtYjlkMS04MTYyNmFhODI1NzIiLCJlbWFpbCI6Im1pc2hhbHR1cmthbmVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjZjZTJmNzUxODVjM2RiYWVhZGNlIiwic2NvcGVkS2V5U2VjcmV0IjoiOWM1NTY1YWRkYTYyYjA1ZGI5NDU5M2YwZDkzZDU5NDUxZjQ5MDk5YTA1MzE3NzJkY2RjZWJlZWU2MjlhYTM4NiIsImV4cCI6MTgwMDY5MTQxM30.227vxvWrFh2kp0SL8gIyeJ-6UsUakh3b0_WoBcbE5Zk";

const PINATA_GATEWAY = "https://gold-permanent-camel-422.mypinata.cloud";

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
    }
  );

  if (!response.ok) throw new Error("Upload failed");
  const data = await response.json();
  return data.IpfsHash;
}

export default function MintTokenPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(9);
  const [supply, setSupply] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    mintAddress: string;
    signature: string;
    metadataUri: string;
  } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMint = useCallback(async () => {
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    if (!name || !symbol || !supply || !imageFile) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      // Step 1: Upload image to IPFS
      setCurrentStep("Uploading image to IPFS...");
      const imageCID = await uploadToPinata(imageFile);
      const imageURI = `${PINATA_GATEWAY}/ipfs/${imageCID}`;

      // Step 2: Create and upload metadata to IPFS
      setCurrentStep("Uploading metadata to IPFS...");
      const metadata = {
        name: name,
        symbol: symbol,
        description: `${name} - Token created with IPFS storage`,
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

      // Step 3: Mint token on Solana
      setCurrentStep("Minting token on Solana...");

      // Generate new keypair for the mint
      const mintKeypair = Keypair.generate();
      console.log("Mint Address:", mintKeypair.publicKey.toBase58());

      // Get rent-exempt balance for mint account
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      // Get associated token account address
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      // Derive metadata account PDA
      const [metadataAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );

      // Calculate supply with decimals
      const mintAmount = BigInt(Number(supply) * Math.pow(10, decimals));

      // Create transaction
      const transaction = new Transaction();

      // Add instructions
      transaction.add(
        // 1. Create mint account
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),

        // 2. Initialize mint with user as authority
        createInitializeMint2Instruction(
          mintKeypair.publicKey,
          decimals,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        ),

        // 3. Create associated token account for the minter
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAccount,
          publicKey,
          mintKeypair.publicKey,
          TOKEN_PROGRAM_ID
        ),

        // 4. Mint tokens to the minter's token account
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedTokenAccount,
          publicKey,
          mintAmount,
          [],
          TOKEN_PROGRAM_ID
        ),

        // 5. Create metadata account
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataAccount,
            mint: mintKeypair.publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name,
                symbol,
                uri: metadataURI,
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null,
              },
              isMutable: true,
              collectionDetails: null,
            },
          }
        )
      );

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("finalized");

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign with mint keypair
      transaction.partialSign(mintKeypair);

      console.log("Sending transaction...");

      // Send transaction (wallet will sign automatically)
      const signature = await sendTransaction(transaction, connection);

      console.log("Transaction sent:", signature);

      // Confirm transaction
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      console.log("Transaction confirmed!");

      setSuccess({
        mintAddress: mintKeypair.publicKey.toBase58(),
        signature,
        metadataUri: metadataURI,
      });

      setCurrentStep("Token minted successfully! 🎉");
    } catch (err: any) {
      console.error("Minting error:", err);
      setError(err.message || "Failed to mint token. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection, name, symbol, decimals, supply, imageFile, sendTransaction]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060606] to-[#0f0f0f] p-4">
      <div className="w-full max-w-lg">
       

        <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white">
          <div className="text-center mb-6 border-b-2 border-[#333] pb-5">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
              Mint New Token
            </h1>
            <p className="text-gray-400 text-base">
              Create SPL Token with IPFS Storage
            </p>
          </div>

          {!publicKey ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">
                👆 Connect your wallet to get started
              </p>
            </div>
          ) : (
            <>
              {/* Name */}
              <div className="mb-4">
                <label className="block mb-2 text-white font-semibold text-sm">
                  TOKEN NAME
                </label>
                <input
                  type="text"
                  placeholder="Token Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  placeholder="Token Symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195] disabled:opacity-50"
                />
              </div>

              {/* Decimals */}
              <div className="mb-4">
                <label className="block mb-2 text-white font-semibold text-sm">
                  DECIMALS
                </label>
                <input
                  type="number"
                  placeholder="Decimals (e.g., 9)"
                  value={decimals}
                  onChange={(e) => setDecimals(Number(e.target.value))}
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195] disabled:opacity-50"
                />
              </div>

              {/* Supply */}
              <div className="mb-4">
                <label className="block mb-2 text-white font-semibold text-sm">
                  INITIAL SUPPLY
                </label>
                <input
                  type="number"
                  placeholder="Initial Supply"
                  value={supply}
                  onChange={(e) => setSupply(e.target.value)}
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[#141414] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#14F195] disabled:opacity-50"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block mb-2 text-white font-semibold text-sm">
                  TOKEN IMAGE
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

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-400 text-sm">
                  ✕ {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-6 rounded-lg bg-[#141414] border border-[#333]">
                  <h3 className="text-white mb-6 text-xl font-bold">
                    ✓ SUCCESS
                  </h3>

                  <div className="mb-5 break-all">
                    <span className="font-semibold text-gray-400 block mb-2 text-xs uppercase">
                      MINT ADDRESS
                    </span>
                    <span className="text-white text-sm bg-[#0a0a0a] p-3 rounded border border-[#333] block font-mono">
                      {success.mintAddress}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(success.mintAddress)
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
                      href={`https://explorer.solana.com/tx/${success.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#14F195] hover:text-[#9945FF] underline font-semibold transition-colors"
                    >
                      View on Solana Explorer →
                    </a>
                  </div>

                  <div className="mb-0">
                    <span className="font-semibold text-gray-400 block mb-2 text-xs uppercase">
                      METADATA URI
                    </span>
                    <a
                      href={success.metadataUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#14F195] hover:text-[#9945FF] underline font-semibold transition-colors"
                    >
                      View Metadata →
                    </a>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="mb-4 text-center p-6 rounded-lg bg-[#141414] border border-[#333]">
                  <div className="border-4 border-t-[#14F195] border-r-transparent border-b-transparent border-l-transparent rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-semibold">{currentStep}</p>
                </div>
              )}

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={loading || !publicKey || !name || !symbol || !supply || !imageFile}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "PROCESSING..." : "MINT TOKEN"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}