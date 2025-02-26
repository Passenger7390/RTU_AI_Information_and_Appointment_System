import axios from 'axios';
// const api = "http://192.168.100.76:8000";

const api = "http://localhost:8000";

// POST request to /auth/token to get JWT token
export const login = async (username: string, password: string) => {
    const response = await axios.post(`${api}/auth/token`, {username, password}, { 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }   
    });
    localStorage.setItem('token', response.data.access_token);
}

// GET request to /auth/users/me to get user info and check for valid token
export const getUser = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(`${api}/auth/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// POST request to /auth/token/refresh to upload file, check the token first, 
// only authenticated users are allowed to upload
export const uploadFile = async (file: File) => {
    const token = localStorage.getItem('token')
    if (!token) {
        localStorage.removeItem('token')
        throw new Error('Not authenticated')
    }

    const formData = new FormData()
    formData.append('file', file)
    const response = await axios.post(`${api}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data.file_url
}

// GET request to / to fetch iamge file name
export const fetchImageFilename = async (): Promise<string[]> => {
    try {
      const response = await axios.get<string[]>(`${api}`);
      return response.data; // returns list of image URLs
    } catch (error) {
      console.error("Error fetching ads:", error);
      return [];
    }
  };

// GET request to /media/{filename} to get image
export const getImage = (filename: string) => {
    return `${api}/media/${filename}`
}

