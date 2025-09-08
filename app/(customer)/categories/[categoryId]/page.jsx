'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPartsByCategory } from '@/lib/api/parts';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const data = await getPartsByCategory(categoryId);
        setParts(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load parts');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchParts();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {parts[0]?.category?.name || 'Category'} Parts
      </h1>
      
      {parts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No parts found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {parts.map((part) => (
            <Link 
              key={part._id} 
              href={`/parts/${part._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 bg-gray-100">
                {part.images?.[0] && (
                  <Image
                    src={`/images/${part.images[0]}`}
                    alt={part.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg mb-2">{part.name}</h3>
                  {part.brand?.logo && (
                    <div className="relative w-12 h-8">
                      <Image
                        src={`/brands/${part.brand.logo}`}
                        alt={part.brand.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {part.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${part.price.toFixed(2)}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    part.stockQuantity > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {part.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
