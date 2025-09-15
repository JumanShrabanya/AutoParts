"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserSession } from '@/context/userSession';
import { FiArrowLeft, FiUpload, FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AddPartPage = () => {
  const router = useRouter();
  const params = useParams();
  const { user, authenticated } = useUserSession();
  const sellerId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    stockQuantity: '1',
    images: [],
    specifications: {
      compatibility: '',
      condition: 'New',
      warranty: ''
    }
  });
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }

        // Fetch brands
        const brandsRes = await fetch('/api/brands');
        const brandsData = await brandsRes.json();
        if (brandsData.success) {
          setBrands(brandsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load required data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('specifications.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const { files: uploadedFiles } = await response.json();
      
      const newImagePreviews = uploadedFiles.map(file => ({
        id: file.url,
        url: file.url,
        publicId: file.publicId
      }));
      
      setImagePreviews(prev => [...prev, ...newImagePreviews]);
      
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  }
  const removeImage = (id) => {
    setImagePreviews(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authenticated || !user || user.role !== 'seller' || user.sellerId !== sellerId) {
      toast.error('Unauthorized access');
      return;
    }
    
    if (imagePreviews.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const partData = {
        ...formData,
        seller: sellerId,
        images: imagePreviews.map(img => ({
          url: img.url,
          publicId: img.publicId
        })),
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
      };
      
      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(partData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create part');
      }
      
      const { part } = await response.json();
      
      toast.success('Part added successfully!');
      router.push(`/seller/${sellerId}/dashboard`);
    } catch (error) {
      console.error('Error creating part:', error);
      toast.error(error.message || 'Failed to add part');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading data...</p>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Adding your part...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Part</h1>
          <p className="text-gray-500">Fill in the details of the part you want to list</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Part Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a brand</option>
                      {brands.map(brand => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Images */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Images
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    {imagePreviews.map((preview) => (
                      <div key={preview.id} className="relative group">
                        <img
                          src={preview.id}
                          alt="Preview"
                          className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(preview.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <div className={`flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isUploading ? 'bg-gray-100 border-blue-300' : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
                    }`}>
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        {isUploading ? (
                          <div className="flex flex-col items-center p-2">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-1"></div>
                            <span className="text-xs text-gray-600">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center p-2">
                            <FiPlus className="w-5 h-5 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-600">Add Image</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Specifications */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compatibility
                    </label>
                    <input
                      type="text"
                      name="specifications.compatibility"
                      value={formData.specifications.compatibility}
                      onChange={handleChange}
                      placeholder="e.g., Honda Civic 2015-2021"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      name="specifications.condition"
                      value={formData.specifications.condition}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="New">New</option>
                      <option value="Used - Like New">Used - Like New</option>
                      <option value="Used - Good">Used - Good</option>
                      <option value="Used - Fair">Used - Fair</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty
                    </label>
                    <input
                      type="text"
                      name="specifications.warranty"
                      value={formData.specifications.warranty}
                      onChange={handleChange}
                      placeholder="e.g., 1 year manufacturer warranty"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Part'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPartPage;
