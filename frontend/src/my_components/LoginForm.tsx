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
  
const LoginForm = () => {
  const username = ""
  const password = ""
  return (
    <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Login</CardTitle>
          <CardDescription>Enter your email and password to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="username-label">Username</Label>
                    <Input id="username" value={username} required></Input>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password-label">Password</Label>
                    <Input id="password" value={password} type="password" required></Input>
                </div>
                <h1>{}</h1>
            </div>
            
        </CardContent>
        <CardFooter>
            <Button type="submit" className="border-black rounded-md border w-full bg-black text-bold text-white hover:text-black hover:bg-white">Login</Button>
        </CardFooter>
    </Card>
  )
}

export default LoginForm