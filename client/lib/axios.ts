import axios from 'axios'
import { signOut } from './auth-client'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5033'

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auto sign out on 401
api.interceptors.request.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut()
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  }
)

export default api