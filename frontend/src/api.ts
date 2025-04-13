import axios from "axios";
import { TableData } from "./my_components/table/Columns";
import { Appointment, CreateProfessor, FAQ, Professor } from "./interface";
// Environment-aware API configuration
const env = import.meta.env.VITE_ENV || "production";
const isDev = env === "development";

// For development, use the full URL; for production, use relative URLs
const api = isDev
  ? import.meta.env.VITE_DEV_API || "http://localhost:8000"
  : "";

// export const api = import.meta.env.VITE_DEV_API;
export const adApi = `${api}/ad`;
export const authApi = `${api}/auth`;
export const chatApi = `${api}/ray`;
export const appointmentApi = `${api}/appointment`;
export const professorApi = `${api}/professor`;
export const otpApi = `${api}/otp`;

// GET request to / to fetch iamge file name
export const fetchImageFilename = async () => {
  try {
    // In development: http://localhost:8000/api/images
    // In production: /api/images (relative URL that Nginx proxies)
    const endpoint = `${api}/api/images`;

    const response = await axios.get(endpoint);
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

export const sendOTPToResetPassword = async (email: string) => {
  const res = await axios.post(`${authApi}/send-otp-to-reset-password`, {
    email,
  });
  return res.data;
};

export const resetPasswordAPI = async (email: string, new_password: string) => {
  const res = await axios.post(`${authApi}/reset-password`, {
    email,
    new_password,
  });
  return res.data;
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
  if (!filename) return "";

  const env = import.meta.env.VITE_ENV || "production";
  const isDev = env === "development";

  // Clean the filename (remove any leading slashes)
  const cleanFilename = filename.startsWith("/")
    ? filename.substring(1)
    : filename;

  if (isDev) {
    // Development: use full URL
    const baseApi = import.meta.env.VITE_DEV_API || "http://localhost:8000";
    // Make sure we don't double up on slashes
    return `${baseApi}/ad/media/${cleanFilename}`;
  }

  // Production: use relative URL for Nginx proxying
  return `/ad/media/${cleanFilename}`;
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
  return res.data;
};

export const addFAQ = async (
  question: string,
  synonyms: string[],
  answer: string
) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await axios.post(
    `${chatApi}/faqs`,
    {
      question,
      synonyms,
      answer,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getFAQs = async () => {
  const res = await axios.get(`${chatApi}/faqs`);
  return res.data;
};

export const updateFAQ = async (params: FAQ) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await axios.put(`${chatApi}/faqs`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteFAQ = async (id: number) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await axios.delete(`${chatApi}/faqs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ======================================================= CHAT API END ========================================================
// ========================================================= OTP API ========================================================
export const sendOTP = async (email: string) => {
  const res = await axios.post(`${otpApi}/send-otp`, { email });
  return res.data;
};

export const verifyOTP = async (email: string, otp: string) => {
  const res = await axios.post(`${otpApi}/verify-otp`, { email, otp });
  return res.data;
};

// ======================================================= OTP API END ========================================================
// ========================================================= PROFESSOR API ========================================================

export const createProfessor = async (professor: CreateProfessor) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await axios.post(`${professorApi}/add-professor`, professor, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getProfessors = async () => {
  const res = await axios.get(`${professorApi}/get-professors`);
  return res.data;
};

export const deleteProfessors = async (ids: string[]) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await axios.delete(`${professorApi}/delete-professor`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      ids,
    },
  });

  return res.data;
};

export const getProfessorById = async (id: string) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await axios.get(`${professorApi}/get-professor/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateProfessorAPI = async (
  professor_uuid: string,
  professor: Professor
) => {
  const token = localStorage.getItem("token");

  if (!token) return;

  const res = await axios.put(
    `${professorApi}/update-professor/${professor_uuid}`,
    professor,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// =============================================================== APPOINTMENT API ============================================================
export const createAppointment = async (data: Appointment) => {
  const res = await axios.post(`${appointmentApi}/create-appointment`, data);
  return res.data;
};

export const getAppointmentById = async (reference: string) => {
  const res = await axios.get(
    `${appointmentApi}/get-appointment-by-reference/${reference}`
  );
  return res.data;
};

export const getAppointments = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await axios.get(`${appointmentApi}/get-appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const actionAppointment = async (reference: string, action: string) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  console.log(action);
  const res = await axios.put(
    `${appointmentApi}/action-appointment/${reference}`,
    { status: action },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getAppointmentSchedule = async (
  professor_uuid: string,
  date: string
) => {
  const res = await axios.get(
    `${appointmentApi}/professor-appointments/${professor_uuid}/${date}`
  );
  console.log(res.data);
  return res.data;
};

// MAP API

export const getMapImage = async (folder: string, filename: string) => {
  if (!filename || !folder) return "";

  const env = import.meta.env.VITE_ENV || "production";
  const isDev = env === "development";

  // Check if filename already includes extension
  const hasExtension = filename.toLowerCase().endsWith(".jpg");
  const filenameFinal = hasExtension ? filename : `${filename}.jpg`;

  if (isDev) {
    const baseApi = import.meta.env.VITE_DEV_API || "http://localhost:8000";
    return `${baseApi}/map/get-image/${folder}/${filenameFinal}`;
  }

  // Production: use relative URL for Nginx proxying
  return `/map/get-image/${folder}/${filenameFinal}`;
};

export const getBuildingFloors = async (building: string) => {
  const res = await axios.get(`${api}/map/list-images/${building}`);
  return res.data;
};
