import axios, { axiosWithAuth } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import axiosInstance from "axios";

export async function getBlogById(blogId: string) {
  try {
    const res = await axios.get(`/blog/${blogId}`);
    return res.data;
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when get blog by id: ${err.response?.data.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
  }
}

export async function getLastEditedBlogId(accessToken: string) {
  try {
    const res = await axiosWithAuth(accessToken).get("/blog/last-edited", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(res.data, "last edited blog id");
    return res.data._id;
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(
        `Error when get last edited blog id: ${err.response?.data.message}`
      );
    } else {
      console.error(`Unexpected error: ${err}`);
    }
  }
}

export async function createBlog({
  accessToken,
  blogData,
}: {
  accessToken: string;
  blogData: {
    title: string;
    content: string;
    image: string;
  };
}) {
  try {
    const res: ApiResponse = await axiosWithAuth(accessToken).post(
      "/blog",
      blogData
    );

    if (res.status === 201) {
      return res.data;
    } else {
      const errorCodes = res.errorCode;
      switch (errorCodes) {
        case "invalid_blog_data":
          console.error(`Invalid blog data: ${res.message}`);
          break;
        default:
          console.error(`Unexpected error1:`, res);
          break;
      }
    }
  } catch (err) {
    console.error(`Error when create blog2: ${err}`);
  }
}

export async function updateBlog({
  accessToken,
  updateData,
}: {
  accessToken: string;
  updateData: {
    _id: string;
    title?: string;
    content?: string;
    image?: string;
    published?: boolean;
  };
}) {
  const payload: {
    title?: string;
    content?: string;
    image?: string;
    published?: boolean;
  } = {};

  if (updateData.title) payload.title = payload.title;
  if (updateData.content) payload.content = payload.content;
  if (updateData.image) payload.image = updateData.image;
  if (updateData.published !== undefined)
    payload.published = updateData.published;
  try {
    const res: ApiResponse = await axiosWithAuth(accessToken).put(
      `/blog/${updateData._id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(err);
      console.error(`Error when update blog: ${err.response?.data.errorCode}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
  }
}

export async function getBlogs(accessToken: string) {
  try {
    const res = await axiosWithAuth(accessToken).get("/blog", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when get blogs: ${err.response?.data.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
  }
}
