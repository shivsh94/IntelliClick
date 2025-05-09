'use client';

import { observer } from 'mobx-react-lite';
import { cityStore } from '@/stores/cityStore';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

export const CityTable = observer(() => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    cityStore.fetchCities();

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !cityStore.loading) {
        cityStore.fetchCities();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, []);
  

  return (
    <div className="p-4">
      <input
        type="text"
        className="w-full p-2 mb-4 border rounded"
        placeholder="Search city..."
        onChange={(e) => cityStore.resetAndSearch(e.target.value)}
      />
      <table className="w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">City</th>
            <th className="border p-2">Country</th>
            <th className="border p-2">Timezone</th>
          </tr>
        </thead>
        <tbody>
          {cityStore.cities.map((city, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border p-2">
                <Link href={`/weather/${city.name}`} target="_self">
                  {city.name}
                </Link>
              </td>
              <td className="border p-2">{city.country}</td>
              <td className="border p-2">{city.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={loaderRef} className="text-center p-4">
        {cityStore.loading ? "Loading..." : ""}
      </div>
    </div>
  );
});
