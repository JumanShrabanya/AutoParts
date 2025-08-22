"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserSession } from "@/context/userSession";
import {
  Settings,
  Shield,
  User,
  Mail,
  Calendar,
  LogOut,
  RefreshCw,
  Edit3,
  MapPin,
  Package,
} from "lucide-react";

export default function ProfilePage() {
  const { user, authenticated, loading, refresh, logout } = useUserSession();
  const params = useParams();
  const router = useRouter();

  const routeUserId = useMemo(
    () => (Array.isArray(params?.userId) ? params.userId[0] : params?.userId),
    [params]
  );

  useEffect(() => {
    if (
      !loading &&
      authenticated &&
      user?.id &&
      routeUserId &&
      user.id !== routeUserId
    ) {
      router.replace(`/profile/${user.id}`);
    }
  }, [loading, authenticated, user, routeUserId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-[90%] mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Hero Background */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-200 border-4 border-white shadow-lg flex items-center justify-center text-blue-700 text-5xl font-bold">
                  {user.name?.charAt(0)?.toUpperCase() ||
                    user.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold text-zinc-50 mb-2">
                  {user.name || "Your Name"}
                </h2>
                <p className="text-lg text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-5 h-5" />
                  {user.email}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {user.role || "customer"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member since {new Date().getFullYear()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={logout}
                  className="cursor-pointer px-6 py-3 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Account Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Account Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Role</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                    {user.role || "customer"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Name</span>
                  <span className="text-gray-800 font-medium">
                    {user.name || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Email</span>
                  <span className="text-gray-800 font-medium">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button className="cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Edit3 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Edit Profile</p>
                      <p className="text-sm text-gray-500">
                        Update your information
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push(`/profile/${user.id}/addresses`)}
                  className="cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Manage Addresses
                      </p>
                      <p className="text-sm text-gray-500">
                        Shipping & billing
                      </p>
                    </div>
                  </div>
                </button>

                <button className="cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <Package className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">View Orders</p>
                      <p className="text-sm text-gray-500">
                        Track your purchases
                      </p>
                    </div>
                  </div>
                </button>

                <button className="cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <Settings className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Preferences</p>
                      <p className="text-sm text-gray-500">
                        Customize your experience
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Security & Stats */}
          <div className="space-y-6">
            {/* Security Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Security
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">
                      Account Protected
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your account is secure with our latest security measures.
                  </p>
                </div>

                <button className="cursor-pointer w-full p-3 text-sm font-medium rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                  Change Password
                </button>
              </div>
            </div>

            {/* Account Stats Card */}
            {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Account Stats
              </h2>

              <div className="space-y-4">
                <div className="cursor-pointer flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-gray-700">Orders</span>
                  <span className="text-2xl font-bold text-blue-600">0</span>
                </div>

                <div className="cursor-pointer flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <span className="text-gray-700">Addresses</span>
                  <span className="text-2xl font-bold text-green-600">0</span>
                </div>

                <div className="cursor-pointer flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <span className="text-gray-700">Wishlist</span>
                  <span className="text-2xl font-bold text-purple-600">0</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
