import { getUser } from "@/api"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import UploadComponent from "@/my_components/UploadComponent"

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token')
      navigate('/login')
    } else {
      fetchUser()
    }
  }, [token])


  const fetchUser = async () => {
    try {
      const response = await getUser()
      setUser(response.data.username)
    } catch (error) {
      console.error(error)
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  return (
    <div>
      <p>This is a protected page, Hello {user}</p>
      <UploadComponent/>
    </div> 
  )
}

export default Dashboard