import axios from "axios";
import { TableData } from "./my_components/table/Columns";
// const api = import.meta.env.VITE_PROD_API;

export const api = import.meta.env.VITE_DEV_API;
export const adApi = `${api}/ad`;
export const authApi = `${api}/auth`;
export const chatApi = `${api}/chat`;

export interface ImageData {
  filename: string;
  duration: number;
}

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

// ========================================================= AUTH API =======================================================

// POST request to /auth/token to get JWT token
export const login = async (username: string, password: string) => {
  const response = await axios.post(
    `${authApi}/token`,
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
  return await axios.get(`${authApi}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ====================================================== AUTH API END =======================================================

// ========================================================= AD API ==========================================================
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
  const response = await axios.post(`${adApi}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.file_url;
};

// GET request to /media/{filename} to get image
export const getImage = (filename: string) => {
  return `${adApi}/media/${filename}`;
};

export const getTableData = async (): Promise<TableData[]> => {
  const response = await axios.get(`${adApi}/table-data`);
  return response.data;
};

export const deleteRows = async (ids: number[]) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  await axios.post(
    `${adApi}/delete`,
    { ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ======================================================= AD API END ========================================================

// ========================================================= CHAT API ========================================================

export const getChatbotResponse = async (query: string) => {
  const res = await axios.post(`${chatApi}/chat`, { query });
  console.log(res);
  return res.data;
};
