import Link from "next/link";
import { FaWolfPackBattalion } from "react-icons/fa";
import { SiHiveBlockchain } from "react-icons/si";
import { FaXTwitter, FaTelegram, FaTiktok } from "react-icons/fa6";

export default function NavBar() {
  return (
    <nav className="w-full px-6 py-4 bg-white fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - Social Icons */}
        <div className="flex gap-6 items-center">
          <Link 
            href="https://dexscreener.com/solana/fthjjgargdsm1cssdfrpxxhxybaqpiw2x5zg5tkxyp9" 
            target="_blank" 
            className="text-4xl text-black hover:opacity-80"
          >
            <FaWolfPackBattalion />
          </Link>
          <Link 
            href="https://www.dextools.io/app/en/token/soback?t=1736541994322" 
            target="_blank" 
            className="text-4xl text-black hover:opacity-80"
          >
            <SiHiveBlockchain />
          </Link>
          <Link 
            href="https://x.com/SOBACK_ITSOVER" 
            target="_blank" 
            className="text-4xl text-black hover:opacity-80"
          >
            <FaXTwitter />
          </Link>
          <Link 
            href="https://t.me/sobacksol" 
            target="_blank" 
            className="text-4xl text-black hover:opacity-80"
          >
            <FaTelegram />
          </Link>
          <Link 
            href="https://www.tiktok.com/@soback_itsover" 
            target="_blank" 
            className="text-4xl text-black hover:opacity-80"
          >
            <FaTiktok />
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex gap-8">
          <Link href="/" className="text-black hover:underline underline-offset-8">
            HOME
          </Link>
          <Link href="/buy" className="text-black hover:underline underline-offset-8">
            BUY
          </Link>
          <Link href="/tokenomics" className="text-black hover:underline underline-offset-8">
            TOKENOMICS
          </Link>
          <Link 
            href="https://index.sobackitsover.xyz/" 
            target="_blank"
            className="text-black hover:underline underline-offset-8"
          >
            OVER & BACK INDEX
          </Link>
        </div>

        {/* Right side - Buy Button */}
        <Link 
          href="https://jup.ag/swap/SOL-AUiXW4YH5TLNFBgVayFBRvgWTz2ApeeM1Br7FCoyrugj"
          target="_blank"
          className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          BUY $BACK
        </Link>
      </div>
    </nav>
  );
} 