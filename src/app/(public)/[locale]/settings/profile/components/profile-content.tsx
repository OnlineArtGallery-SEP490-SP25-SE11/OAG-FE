"use client";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Pencil,
  Star,
  UserCheck,
  Users,
  MessageSquare,
  FolderOpen,
  Info,
  FileText,
} from "lucide-react";
// import EditProfileDialog from './EditProfileDialog';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { subscribeToUserUpdates } from "@/lib/user-updates";
import UpdateAvatar from "./UpdateAvatar";
import { Badge } from "@/components/ui/badge";
import Collection from "./collection"; // Import the Collection component
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  getFollowersCount,
  getFollowersList,
  getFollowingCount,
  getFollowingList,
} from "@/service/user";
import { createAxiosInstance } from "@/lib/axios";

// Định nghĩa kiểu dữ liệu cho người dùng
interface UserType {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  image?: string;
}

interface ProfileContentProps {
  initialData: {
    name?: string;
    email?: string;
    role?: string[];
    isPremium?: boolean;
    image?: string;
    googleImage?: string;
    address?: string;
    artistProfile?: {
      bio?: string;
      genre?: string[];
    };
    createdAt: string;
    artworksCount?: number;
    followersCount?: number;
    followingCount?: number;
  };
}

// Helper function to strip HTML tags
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, "");
};

const ProfileContent = ({ initialData }: ProfileContentProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations("profile");

  const [activeTab, setActiveTab] = useState("about");

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosInstance = await createAxiosInstance({ useToken: true });
        if (!axiosInstance) return;

        // Lấy số lượng followers và following
        const followers = await getFollowersCount(axiosInstance);
        const following = await getFollowingCount(axiosInstance);

        setFollowersCount(followers);
        setFollowingCount(following);
      } catch (error) {
        console.error("Lỗi khi lấy số lượng followers/following:", error);
      }
    };

    fetchData();
  }, []);

  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const axiosInstance = await createAxiosInstance({ useToken: true });
        if (!axiosInstance) return;

        const followersData = await getFollowersList(axiosInstance);
        const followingData = await getFollowingList(axiosInstance);

        setFollowers(followersData);
        setFollowing(followingData);
      } catch (error) {
        console.error("Error fetching followers/following:", error);
      }
    }
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const axiosInstance = await createAxiosInstance({ useToken: true });
  //       if (!axiosInstance) return;

  //       // Lấy số lượng followers và following
  //       const followers = await getFollowersCount(axiosInstance);
  //       const following = await getFollowingCount(axiosInstance);

  //       setFollowersCount(followers);
  //       setFollowingCount(following);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy số lượng followers/following:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const subscription = subscribeToUserUpdates((updatedUser) => {
      if (updatedUser.isPremium !== initialData?.isPremium) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, initialData?.isPremium]);

  useEffect(() => {
    console.log("follower:", followers);
    console.log("following:", following);
    console.log("follower count:", followersCount);
    console.log("following count:", followingCount);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Profile Section */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-3">
              <UpdateAvatar
                user={{
                  image: initialData.image,
                  isPremium: initialData.isPremium || false,
                }}
              />
              <h1 className="text-2xl font-bold text-center">
                {initialData.name}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                {initialData.role?.includes("artist") && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                  >
                    {t("common.artist_badge")}
                  </Badge>
                )}
                {initialData.isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-none">
                    {t("common.premium_badge")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Bio Headline */}
            {/* {initialData.role?.includes("artist") && initialData.artistProfile?.bio && (
              <div className="text-center border-t border-gray-200 pt-4">
                <p className="text-gray-700 italic text-sm">
                  {stripHtml(initialData.artistProfile.bio).substring(0, 120)}
                  {stripHtml(initialData.artistProfile.bio).length > 120 ? "..." : ""}
                </p>
              </div>
            )} */}

            {/* Social Icons */}
            {/* <div className="flex justify-center space-x-2 py-3 border-t border-gray-200">
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
              </Button>
            </div> */}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {!initialData.role?.includes("artist") && (
                <Button
                  onClick={() => router.push("/settings")}
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {t("common.become_artist")}
                </Button>
              )}
              <Button
                onClick={() => router.push("/settings/profile/edit")}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <Pencil className="w-4 h-4 mr-2" />
                {t("view.edit_profile")}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xl font-bold text-purple-600">
                  {initialData.artworksCount || 0}
                </p>
                <p className="text-gray-600 text-xs">{t("common.artworks")}</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-pink-600">
                  {followersCount || 0}
                </p>
                <p className="text-gray-600 text-xs">{t("common.followers")}</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-purple-600">
                  {followingCount || 0}
                </p>
                <p className="text-gray-600 text-xs">{t("common.following")}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              <button
                onClick={() => setActiveTab("about")}
                className={`px-6 py-3 text-left flex items-center ${
                  activeTab === "about"
                    ? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <Info className="w-4 h-4 mr-3" />
                <span>{t("view.about")}</span>
              </button>
              <button
                onClick={() => setActiveTab("collections")}
                className={`px-6 py-3 text-left flex items-center ${
                  activeTab === "collections"
                    ? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <FolderOpen className="w-4 h-4 mr-3" />
                <span>{t("view.collections")}</span>
              </button>
              <button
                onClick={() => setActiveTab("followers")}
                className={`px-6 py-3 text-left flex items-center ${
                  activeTab === "followers"
                    ? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <Users className="w-4 h-4 mr-3" />
                <span>{t("common.followers")}</span>
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`px-6 py-3 text-left flex items-center ${
                  activeTab === "following"
                    ? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <UserCheck className="w-4 h-4 mr-3" />
                <span>{t("common.following")}</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-8 lg:col-span-9">
          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            {activeTab === "about" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">
                  {t("view.about")}
                </h2>

                {/* Cover Image và Thông tin nổi bật */}
                <div className="relative w-full h-64 overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-purple-100 to-pink-100">
                  {/* Ảnh bìa từ avatar */}
                  {initialData.image && (
                    <div className="absolute inset-0 w-full h-full">
                      <div
                        className="w-full h-full bg-center bg-no-repeat bg-cover"
                        style={{
                          backgroundImage: `url(${initialData.image})`,
                          filter: "blur(2px)",
                          transform: "scale(1.1)",
                          opacity: "0.8",
                        }}
                      ></div>
                      {/* Lớp gradient phủ */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  )}
                </div>

                {/* Thông tin chi tiết */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cột bên trái - Tiểu sử */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center border-b pb-2">
                        <Info className="w-5 h-5 mr-2 text-purple-500" />
                        {t("view.biography")}
                      </h3>
                      <div className="prose max-w-none">
                        {initialData.role?.includes("artist") &&
                        initialData.artistProfile?.bio ? (
                          <div
                            className="text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html: initialData.artistProfile.bio,
                            }}
                          />
                        ) : (
                          <p className="italic text-gray-500">
                            {initialData.name} {t("view.default_bio")}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phong cách nghệ thuật */}
                    {initialData.role?.includes("artist") &&
                      initialData.artistProfile?.genre &&
                      initialData.artistProfile.genre.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center border-b pb-2">
                            <FileText className="w-5 h-5 mr-2 text-purple-500" />
                            {t("edit.art_styles")}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {initialData.artistProfile.genre.map(
                              (genre: string) => (
                                <Badge
                                  key={genre}
                                  variant="secondary"
                                  className="bg-purple-100 text-purple-800 hover:bg-purple-200 py-1 px-3 text-sm"
                                >
                                  {genre}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Cột bên phải - Thông tin liên hệ */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center border-b pb-2">
                        <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
                        {t("view.contact_info")}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 text-purple-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {t("common.email")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {initialData.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 text-purple-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {t("edit.address")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {initialData.address || t("view.no_address")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 text-purple-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {t("view.joined_date")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                initialData.createdAt
                              ).toLocaleDateString("vi-VN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Số liệu thống kê */}
                        <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-gray-200">
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-600">
                              {initialData.artworksCount || 0}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {t("common.artworks")}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-pink-600">
                              {followersCount || 0}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {t("common.followers")}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-600">
                              {followingCount || 0}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {t("common.following")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "collections" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">
                  {t("view.collections")}
                </h2>
                <div className="bg-white rounded-xl">
                  <Collection />
                </div>
              </div>
            )}

            {activeTab === "followers" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">
                  {t("common.followers")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {followers.length > 0 ? (
                    followers.map((user) => (
                      <motion.div
                        key={user._id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md"
                      >
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">
                        {t("view.no_followers")}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "following" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">
                  {t("common.following")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {following.length > 0 ? (
                    following.map((user) => (
                      <motion.div
                        key={user._id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md"
                      >
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">
                        {t("view.no_following")}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-12 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-gray-200 rounded-lg h-[500px]"></div>
        </div>
        <div className="md:col-span-8 lg:col-span-9">
          <div className="bg-gray-200 rounded-lg h-[300px]"></div>
          <div className="mt-8 bg-gray-200 rounded-lg h-[200px]"></div>
        </div>
      </div>
    </div>
  );
}

export default ProfileContent;
