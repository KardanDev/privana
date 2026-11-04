export interface ViewerDTO {
  creatorId: string | null;
  creatorStatus: string | null;
  email: string;
  id: string;
  image: string | null;
  name: string;
  role: string;
}
export interface CreatorDTO {
  avatarUrl: string | null;
  bio: string;
  category: string;
  coverUrl: string | null;
  displayName: string;
  followerCount: number;
  handle: string;
  id: string;
  isDemo: boolean;
  isFollowing: boolean;
  location: string;
  monthlyPriceCents: number;
  postCount: number;
  status: string;
  userId: string;
}
export interface PostDTO {
  body: string | null;
  bookmarkCount: number;
  commentCount: number;
  createdAt: string;
  creator: CreatorDTO;
  excerpt: string;
  id: string;
  isBookmarked: boolean;
  isLiked: boolean;
  likeCount: number;
  locked: boolean;
  mediaType: string | null;
  mediaUrl: string | null;
  previewUrl: string | null;
  status: string;
  title: string;
  visibility: string;
}
export interface CommentDTO {
  author: { id: string; name: string; image: string | null };
  body: string;
  createdAt: string;
  id: string;
}
export interface MembershipDTO {
  creator: CreatorDTO;
  expiresAt: string | null;
  id: string;
  status: string;
}
export interface ConversationDTO {
  id: string;
  lastMessage: string | null;
  otherUser: { id: string; name: string; image: string | null };
  updatedAt: string;
}
export interface MessageDTO {
  body: string;
  createdAt: string;
  id: string;
  senderId: string;
}
export interface NotificationDTO {
  body: string;
  createdAt: string;
  href: string;
  id: string;
  readAt: string | null;
  title: string;
}
export interface SettingsDTO {
  emailNotifications: boolean;
  image: string | null;
  locale: string;
  name: string;
}
export interface PageDTO<T> {
  items: T[];
  nextCursor: string | null;
}
