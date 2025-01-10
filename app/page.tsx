import Image from "next/image";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col items-center justify-center gap-8 pt-24">
        <Image
          src="/we-are-back.png"
          alt="We are so $BACK"
          width={1800}
          height={900}
          priority
          className="w-[900px] max-w-[98vw] h-auto"
        />
        <div className="text-center text-black tracking-wider" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
          <h1 className="text-[72px] leading-tight font-bold mb-8">
            IT&apos;S SEND EVERYTHING SEASON.
          </h1>
          <h2 className="text-[72px] leading-tight font-bold mb-16">
            BUY $BACK.
          </h2>
          <div className="text-[48px] leading-tight font-normal space-y-4">
            <p>NO KOLS.</p>
            <p>NO CABALS.</p>
            <p>NO BUNDLES.</p>
            <p>NO BULLSHIT.</p>
            <p>UP ONLY.</p>
            <p>IT&apos;S THE BULL MARKET -</p>
            <p>FUCKING SEND IT.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
