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
const AddAds = () => {
  return (
    <Card className="w-96">
        <CardHeader>
          <CardTitle>Add Advertisement</CardTitle>
          <CardDescription>Enter your email and password to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="title-label" className="font-semibold">Title</Label>
          <Input type="title" placeholder="Title"/>
          <Label htmlFor="media_url-label" className="font-semibold">URL</Label>
          <Input type="media_url" placeholder="https://example.com"/>
          <Label htmlFor="duration-label" className="font-semibold">Duration</Label>
          <Input type="duration" placeholder="30"/>
        </CardContent>
        <CardFooter className="flex justify-between">
        <Button variant="outline">Add</Button>
        <Button>Cancel</Button>
        </CardFooter>
      </Card>
  )
}

export default AddAds