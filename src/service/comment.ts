"use server";
import axios, { createApi } from '@/lib/axios';
import axiosInstance from 'axios';

export async function createComment({
  accessToken,
  blogId,
  content
}: {
  accessToken: string;
  blogId: string;
  content: string;
}) {
  try {
    const res = await createApi(accessToken).post('/comments', {
      blogId,
      content
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (res.status === 201) {
      return res.data;
    } else {
      console.error(`Failed to create comment: ${res.statusText}`);
    }
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when creating comment: ${err.response?.data.message}`);
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
  content
}: {
  accessToken: string;
  commentId: string;
  content: string;
}) {
  try {
    const res = await createApi(accessToken).put(`/comments/${commentId}`, {
      content
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (res.status === 200) {
      return res.data;
    } else {
      console.error(`Failed to update comment: ${res.statusText}`);
    }
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when updating comment: ${err.response?.data.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
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