import axios from "axios";
import { TableData } from "./my_components/table/Columns";
// const api = "http://192.168.100.76:8000";

export const api = "http://localhost:8000";

export interface ImageData {
  filename: string;
  duration: number;
}

// POST request to /auth/token to get JWT token
export const login = async (username: string, password: string) => {
  const response = await axios.post(
    `${api}/auth/token`,
    { username, password },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  localStorage.setItem("token", response.data.access_token);
};

// GET request to /auth/users/me to get user info and check for valid token
export const getUser = async () => {
  const token = localStorage.getItem("token");
  return await axios.get(`${api}/auth/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// POST request to /auth/token/refresh to upload file, check the token first,
// only authenticated users are allowed to upload
export const uploadFile = async (
  file: File,
  duration: number,
  title: string,
  date: string
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    localStorage.removeItem("token");
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("duration", duration.toString());
  formData.append("title", title);
  formData.append("expires_in", date);
  const response = await axios.post(`${api}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.file_url;
};

// GET request to / to fetch iamge file name
export const fetchImageFilename = async (): Promise<ImageData[]> => {
  try {
    const response = await axios.get<ImageData[]>(`${api}`);
    return response.data; // returns list of image URLs
  } catch (error) {
    console.error("Error fetching ads:", error);
    return [];
  }
};

// GET request to /media/{filename} to get image
export const getImage = (filename: string) => {
  return `${api}/media/${filename}`;
};

export const getTableData = async (): Promise<TableData[]> => {
  const response = await axios.get(`${api}/table-data`);
  return response.data;
};

export const deleteRows = async (ids: number[]) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  await axios.post(
    `${api}/delete`,
    { ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
