import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stage from "@/components/Stage";

export default function Home() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-4 pb-4 sm:px-5 lg:px-6">
        <Header />
        <Hero />
        <Stage />
      </div>
    </main>
  );
}
