"use client"
import { useEffect, useState } from 'react';
import { useUserSession } from '@/context/userSession';
import api from '@/lib/axios';

export function useSellerProfile(sellerId) {
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, authenticated, loading: sessionLoading } = useUserSession();

  useEffect(() => {
    // Don't fetch if we're still loading the session or if we're not authenticated
    if (sessionLoading || !authenticated) {
      setLoading(true);
      return;
    }

    // If we don't have a sellerId, we can't fetch the profile
    if (!sellerId) {
      setLoading(false);
      setError('No seller ID provided');
      return;
    }

    const fetchSellerProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use our configured axios instance
        const response = await api.get('/seller/profile');
        
        
        if (response.data.success) {
          setSellerProfile(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch seller profile');
        }
      } catch (err) {
        console.error('Error fetching seller profile');
        setError(err.response?.data?.message || err.message || 'Failed to load seller profile');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProfile();
  }, [sellerId, authenticated, sessionLoading]);

  return { sellerProfile, loading, error };
}
