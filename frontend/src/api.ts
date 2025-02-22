import axios from 'axios';
const api = "http://localhost:8000";


export const login = async (username: string, password: string) => {
    const response = await axios.post(`${api}/auth/token`, {username, password}, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }   
    });
    localStorage.setItem('token', response.data.access_token);
}

export const getUser = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(`${api}/auth/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

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
            'Content-Type': 'multipart/form-data'
        }
    })

    return response.data.file_url
}

export const fetchAds = async (): Promise<string[]> => {
    try {
      const response = await axios.get<string[]>(`${api}`);
      return response.data; // List of image URLs
    } catch (error) {
      console.error("Error fetching ads:", error);
      return [];
    }
  };

export const getImage = (filename: string) => {
    return `${api}/media/${filename}`
}

