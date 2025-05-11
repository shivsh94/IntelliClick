import CityTable from "@/components/CityTable";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <h1 className="text-3xl text-center font-bold py-6">🌍 City Weather Finder</h1>
      <CityTable />
    </main>
  );
}
