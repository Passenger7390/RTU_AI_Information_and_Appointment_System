import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from 'react'
import { login } from '@/api'
import { useNavigate } from "react-router-dom"

const LoginForm = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    } 
  }, [token])

  const handleSubmit = async () => {
    
    if (username === '' || password === '') {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      await login(username, password)
      navigate('/dashboard')
    } catch (error) {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Login</CardTitle>
          <CardDescription>Enter your username and password to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="username-label">Username</Label>
                    <Input id="username" value={username} required onChange={(e) => setUsername(e.target.value)}></Input>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password-label">Password</Label>
                    <Input id="password" value={password} type="password" required onChange={(e) => setPassword(e.target.value)}></Input>
                </div>
                
            </div>
            {error && <Label className="text-red-600">{error}</Label>}
        </CardContent>
        <CardFooter>
            
            <Button type="submit" disabled={loading} onClick={handleSubmit} className="w-full">
              {loading ? 'Logging in...' : 'Log in'}
            </Button>

        </CardFooter>
    </Card>
  )
}

export default LoginForm