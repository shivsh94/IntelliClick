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
    cityStore.fetchCities();
  
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !cityStore.loading) {
        cityStore.fetchCities();
      }
    }, { threshold: 0.5 });
  
    // Store the current ref value in a variable
    const currentLoaderRef = loaderRef.current;
    
    if (currentLoaderRef) {
      intersectionObserver.observe(currentLoaderRef);
    }
    
    return () => {
      if (currentLoaderRef) {
        intersectionObserver.disconnect();
      }
    };
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    cityStore.resetAndSearch(e.target.value);
  };
  
  return (
    <div className="p-4 w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-3 sm:p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
          placeholder="Search city or country..."
          onChange={handleSearch}
        />
      </div>
      
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-2 sm:px-4 text-left font-medium text-gray-700 border-b text-sm sm:text-base">City</th>
              <th className="py-3 px-2 sm:px-4 text-left font-medium text-gray-700 border-b text-sm sm:text-base min-[330px]:table-cell">Country</th>
              <th className="py-3 px-2 sm:px-4 text-left font-medium text-gray-700 border-b text-sm sm:text-base hidden md:table-cell">Timezone</th>
            </tr>
          </thead>
          <tbody>
            {cityStore.cities.map((city: City, idx: number) => (
              <tr key={idx} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="py-3 px-2 sm:px-4 text-blue-600 text-sm sm:text-base">
                  <Link href={`/weather/${city.name}`} className="hover:text-blue-800 hover:underline">
                    {city.name}
                  </Link>
                </td>
                <td className="py-3 px-2 sm:px-4 text-sm sm:text-base min-[330px]:table-cell">{city.country}</td>
                <td className="py-3 px-2 sm:px-4 text-sm sm:text-base hidden md:table-cell">{city.timezone}</td>
              </tr>
            ))}
            {cityStore.cities.length === 0 && !cityStore.loading && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500 text-sm sm:text-base">
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