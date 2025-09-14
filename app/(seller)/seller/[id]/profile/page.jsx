"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserSession } from "@/context/userSession";
import { FiArrowLeft, FiEdit2, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCreditCard } from "react-icons/fi";
import { sellerProfileService } from "@/lib/api/sellerProfile";
import { toast } from 'react-toastify';

const ProfileField = ({ label, value, icon: Icon }) => (
  <div className="mb-5">
    <div className="flex items-center text-gray-500 text-sm mb-1.5 font-medium">
      {Icon && <Icon className="mr-2 w-4 h-4 text-blue-500" />}
      {label}
    </div>
    <div className="text-gray-800 text-base bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">
      {value || <span className="text-gray-400">Not provided</span>}
    </div>
  </div>
);

export default function SellerProfilePage() {
  const { user, authenticated, loading } = useUserSession();
  const router = useRouter();
  const params = useParams();
  const [seller, setSeller] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const sellerId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        setIsLoading(true);
        const response = await sellerProfileService.getProfile();
        setSeller(response.data);
      } catch (error) {
        console.error('Error fetching seller profile:', error);
        toast.error(error.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (authenticated && user?.role === 'seller') {
      fetchSellerProfile();
    }
  }, [authenticated, user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authenticated || !user || user.role !== "seller") {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Store Profile</h1>
            <p className="text-gray-500">Manage your store information</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-600 font-bold mb-4 md:mb-0 md:mr-6">
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{seller?.storeName || 'My Store'}</h2>
                <p className="text-gray-600">{user?.name || 'Store Owner'}</p>
                <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              </div>
              <button 
                onClick={() => {}}
                className="mt-4 md:mt-0 px-5 py-2.5 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg font-medium flex items-center shadow-sm hover:shadow transition-all"
              >
                <FiEdit2 className="mr-2 w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Store Information */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Store Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField 
                  label="Store Name" 
                  value={seller?.storeName} 
                  icon={FiBriefcase}
                />
                <ProfileField 
                  label="Contact Email" 
                  value={user?.email} 
                  icon={FiMail}
                />
                <ProfileField 
                  label="Phone Number" 
                  value={seller?.phone} 
                  icon={FiPhone}
                />
                <ProfileField 
                  label="Store Address" 
                  value={
                    seller?.businessAddress 
                      ? `${seller.businessAddress.street || ''}, ${seller.businessAddress.city || ''}, ${seller.businessAddress.state || ''} ${seller.businessAddress.postalCode || ''}`
                      : null
                  } 
                  icon={FiMapPin}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField 
                  label="Business Type" 
                  value={seller?.businessType} 
                  icon={FiBriefcase}
                />
                <ProfileField 
                  label="Tax ID" 
                  value={seller?.taxId} 
                  icon={FiCreditCard}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
