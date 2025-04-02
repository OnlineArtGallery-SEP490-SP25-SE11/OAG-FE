"use server";
import axios, { createApi } from '@/lib/axios';
import axiosInstance from 'axios';

export async function createComment({
  accessToken,
  blogId,
  content,
  parentId = null
}: {
  accessToken: string;
  blogId: string;
  content: string;
  parentId?: string | null;
}) {
  try {
    const res = await createApi(accessToken).post('/comments', {
      blogId,
      content,
      parentId // null hoặc có giá trị đều được
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (res.status === 201) {
      return res.data; // Trả về comment mới tạo (có thể là comment cha hoặc reply)
    } else {
      console.error(`Failed to create comment: ${res.statusText}`);
    }
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when creating comment: ${err.response?.data?.message || err.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
  }
}

export async function getCommentsByBlogId(blogId: string) {
  try {
    const res = await axios.get(`/comments/blog/${blogId}`);
    return res.data;
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when fetching comments: ${err.response?.data.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
    return [];
  }
}

export async function updateComment({
  accessToken,
  commentId,
  content,
  replies,
}: {
  accessToken: string;
  commentId: string;
  content: string;
  replies: string[];
}) {
  try {
    console.log("⏳ Đang cập nhật comment cha...", {
      commentId,
      content,
      replies,
    });

    const res = await createApi(accessToken).put(
      `/comments/${commentId}`,
      {
        content,
        replies, // gửi replies mới lên server
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.status === 200) {
      console.log("✅ Comment cha đã được cập nhật thành công:", res.data);
      return res.data; // Trả về comment sau khi cập nhật
    } else {
      console.error(`❌ Failed to update comment: ${res.statusText}`);
    }
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật comment:", err);
  }
}


export async function deleteComment({
  accessToken,
  commentId
}: {
  accessToken: string;
  commentId: string;
}) {
  try {
    const res = await createApi(accessToken).delete(`/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (res.status === 200) {
      return true;
    } else {
      console.error(`Failed to delete comment: ${res.statusText}`);
      return false;
    }
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when deleting comment: ${err.response?.data.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
    return false;
  }
}