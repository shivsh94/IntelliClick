"use client";
import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { cityStore } from '@/stores/cityStore';
import Link from 'next/link';

interface City {
  name: string;
  country: string;
  timezone: string;
}

const CityTable = observer(() => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Initial fetch
    cityStore.fetchCities();
    
    // Setup intersection observer for infinite scrolling
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !cityStore.loading) {
        cityStore.fetchCities();
      }
    }, { threshold: 0.5 });
    
    if (loaderRef.current) {
      intersectionObserver.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        intersectionObserver.disconnect();
      }
    };
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    cityStore.resetAndSearch(e.target.value);
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search city or country..."
          onChange={handleSearch}
        />
      </div>
      
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">City</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Country</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Timezone</th>
            </tr>
          </thead>
          <tbody>
            {cityStore.cities.map((city: City, idx: number) => (
              <tr key={idx} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="py-3 px-4 text-blue-600">
                  <Link href={`/weather/${city.name}`} className="hover:text-blue-800 hover:underline">
                    {city.name}
                  </Link>
                </td>
                <td className="py-3 px-4">{city.country}</td>
                <td className="py-3 px-4">{city.timezone}</td>
              </tr>
            ))}
            {cityStore.cities.length === 0 && !cityStore.loading && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500">
                  No cities found. Try a different search term.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div ref={loaderRef} className="text-center py-4">
        {cityStore.loading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : null}
      </div>
    </div>
  );
});

export default CityTable;