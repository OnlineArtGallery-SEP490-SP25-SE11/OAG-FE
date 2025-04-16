'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth-client';
import { getUserProfile, followUser, unfollowUser } from '@/service/user';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Mail,
  UserCheck,
  UserPlus,
  Star,
  FolderOpen,
  Users,
  Info,
  FileText,
  MessageSquare
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string[];
  createdAt: string;
  artworksCount?: number;
  artistProfile?: {
    bio?: string;
    genre?: string[] | string;
    experience?: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      website?: string;
    };
  };
  following: { _id: string; name: string; email: string; image?: string }[];
  followers: { _id: string; name: string; email: string; image?: string }[];
}

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const { user: currentUser } = useAuth();
  const accessToken = currentUser?.accessToken;
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        if (!accessToken) {
          toast.error('Vui lòng đăng nhập để xem thông tin người dùng');
          setLoading(false);
          return;
        }
        const response = await getUserProfile(accessToken, userId);
        setUser(response.user as unknown as User);
        setIsFollowing(response.isFollowing);
      } catch (error) {
        toast.error('Không thể tải thông tin người dùng');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, accessToken]);

  const handleFollow = async () => {
    if (!accessToken) {
      toast.error('Vui lòng đăng nhập để thực hiện thao tác này');
      return;
    }

    try {
      if (isFollowing) {
        await unfollowUser(accessToken, userId);
        setIsFollowing(false);
        toast.success('Đã hủy theo dõi');
      } else {
        await followUser(accessToken, userId);
        setIsFollowing(true);
        toast.success('Đã theo dõi');
      }
    } catch (error) {
      toast.error('Thao tác không thành công');
      console.error(error);
    }
  };

  if (loading) {
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

  if (!user) {
    return <div className="container mx-auto mt-10 px-4">Không tìm thấy người dùng.</div>;
  }

  const isArtist = user.role?.includes('artist');
  const genres = Array.isArray(user.artistProfile?.genre)
    ? user.artistProfile?.genre
    : user.artistProfile?.genre ? [user.artistProfile.genre] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Profile Section */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || '/default-avatar.png'} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold text-center">{user.name}</h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                {isArtist && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                  >
                    Nghệ sĩ
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {currentUser && currentUser.id !== userId && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollow}
                  className="w-full"
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Đang theo dõi
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Theo dõi
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xl font-bold text-purple-600">
                  {user.artworksCount || 0}
                </p>
                <p className="text-gray-600 text-xs">Tác phẩm</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-pink-600">
                  {user.followers?.length || 0}
                </p>
                <p className="text-gray-600 text-xs">Người theo dõi</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-purple-600">
                  {user.following?.length || 0}
                </p>
                <p className="text-gray-600 text-xs">Đang theo dõi</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              <button
                onClick={() => setActiveTab("about")}
                className={`px-6 py-3 text-left flex items-center ${activeTab === "about"
                  ? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
                  : "hover:bg-gray-50"
                  }`}
              >
                <Info className="w-4 h-4 mr-3" />
                <span>Thông tin</span>
              </button>
              <button
                onClick={() => setActiveTab("followers")}
                className={`px-6 py-3 text-left flex items-center ${activeTab === "followers"
                  ? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
                  : "hover:bg-gray-50"
                  }`}
              >
                <Users className="w-4 h-4 mr-3" />
                <span>Người theo dõi</span>
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`px-6 py-3 text-left flex items-center ${activeTab === "following"
                  ? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
                  : "hover:bg-gray-50"
                  }`}
              >
                <UserCheck className="w-4 h-4 mr-3" />
                <span>Đang theo dõi</span>
              </button>
              {isArtist && (
                <button
                  onClick={() => setActiveTab("artist")}
                  className={`px-6 py-3 text-left flex items-center ${activeTab === "artist"
                    ? "bg-purple-50 border-l-4 border-purple-500 text-purple-700"
                    : "hover:bg-gray-50"
                    }`}
                >
                  <Star className="w-4 h-4 mr-3" />
                  <span>Thông tin nghệ sĩ</span>
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-8 lg:col-span-9">
          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            {activeTab === "about" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">Thông tin</h2>

                {/* Cover Image và Thông tin nổi bật */}
                <div className="relative w-full h-64 overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-purple-100 to-pink-100">
                  {/* Ảnh bìa từ avatar */}
                  {user.image && (
                    <div className="absolute inset-0 w-full h-full">
                      <div
                        className="w-full h-full bg-center bg-no-repeat bg-cover"
                        style={{
                          backgroundImage: `url(${user.image})`,
                          filter: 'blur(2px)',
                          transform: 'scale(1.1)',
                          opacity: '0.8'
                        }}
                      ></div>
                      {/* Lớp gradient phủ */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center border-b pb-2">
                      <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
                      Thông tin liên hệ
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Ngày tham gia</p>
                          <p className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === "followers" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">Người theo dõi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.followers.length > 0 ? (
                    user.followers.map((follower) => (
                      <div
                        key={follower._id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={follower.image || '/default-avatar.png'} alt={follower.name} />
                            <AvatarFallback>{follower.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{follower.name}</h3>
                            <p className="text-sm text-gray-600">{follower.email}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.href = `/settings/profile/${follower._id}`}
                        >
                          Xem hồ sơ
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">Không có người theo dõi</h3>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "following" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">Đang theo dõi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.following.length > 0 ? (
                    user.following.map((following) => (
                      <div
                        key={following._id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={following.image || '/default-avatar.png'} alt={following.name} />
                            <AvatarFallback>{following.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{following.name}</h3>
                            <p className="text-sm text-gray-600">{following.email}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.href = `/settings/profile/${following._id}`}
                        >
                          Xem hồ sơ
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">Không đang theo dõi ai</h3>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "artist" && isArtist && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">Thông tin nghệ sĩ</h2>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  {user.artistProfile ? (
                    <div className="space-y-6">
                      {user.artistProfile.bio && (
                        <div>
                          <h4 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-purple-500" />
                            Tiểu sử
                          </h4>
                          <div className="text-gray-700 bg-gray-50 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: user.artistProfile.bio || '' }} />
                        </div>
                      )}

                      {genres && genres.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                            <Star className="w-5 h-5 mr-2 text-purple-500" />
                            Thể loại
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {genres.map((genre, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-purple-100 text-purple-800 hover:bg-purple-200 py-1 px-3 text-sm"
                              >
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {user.artistProfile.experience && (
                        <div>
                          <h4 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                            Kinh nghiệm
                          </h4>
                          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{user.artistProfile.experience}</p>
                        </div>
                      )}

                      {user.artistProfile.socialLinks && (
                        <div>
                          <h4 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
                            Liên kết mạng xã hội
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            {user.artistProfile.socialLinks.instagram && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Instagram:</span>
                                <a
                                  href={`https://instagram.com/${user.artistProfile.socialLinks.instagram}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline"
                                >
                                  {user.artistProfile.socialLinks.instagram}
                                </a>
                              </div>
                            )}

                            {user.artistProfile.socialLinks.twitter && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Twitter:</span>
                                <a
                                  href={`https://twitter.com/${user.artistProfile.socialLinks.twitter}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline"
                                >
                                  {user.artistProfile.socialLinks.twitter}
                                </a>
                              </div>
                            )}

                            {user.artistProfile.socialLinks.website && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Website:</span>
                                <a
                                  href={user.artistProfile.socialLinks.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline"
                                >
                                  {user.artistProfile.socialLinks.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tác phẩm của nghệ sĩ */}
                      <div className="mt-8">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center border-b pb-2">
                          <FolderOpen className="w-5 h-5 mr-2 text-purple-500" />
                          Tác phẩm nghệ thuật
                        </h4>

                        {/* Hiển thị tác phẩm */}
                        {user.artworksCount && user.artworksCount > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Mẫu hiển thị ảnh - Trong thực tế sẽ lấy từ API */}
                            {Array.from({ length: Math.min(6, user.artworksCount) }).map((_, index) => (
                              <div
                                key={index}
                                className="relative group overflow-hidden rounded-lg shadow-md aspect-square bg-gray-100 hover:shadow-xl transition-all duration-300"
                              >
                                {/* Ảnh mẫu (trong thực tế sẽ thay bằng ảnh thật) */}
                                <div
                                  className="w-full h-full bg-center bg-cover"
                                  style={{
                                    backgroundImage: user.image ?
                                      `url(${user.image})` :
                                      "url(/placeholder-artwork.jpg)"
                                  }}
                                ></div>

                                {/* Overlay khi hover */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                                  <span className="text-white font-medium text-sm px-3 py-2 rounded-full bg-purple-700 bg-opacity-80">
                                    Xem chi tiết
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">Chưa có tác phẩm nào</h3>
                          </div>
                        )}

                        {/* Nút xem thêm */}
                        {user.artworksCount && user.artworksCount > 6 && (
                          <div className="text-center mt-4">
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={() => window.location.href = `/artworks?artist=${userId}`}
                            >
                              Xem tất cả {user.artworksCount} tác phẩm
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">Không có thông tin nghệ sĩ</h3>
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
}