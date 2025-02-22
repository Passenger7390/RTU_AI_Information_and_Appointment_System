import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/api";

const UploadComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setLoading(true)
      await uploadFile(file)
      // TODO: Do a toast in here

    } catch(error) {

      alert("Failed to upload file")

    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex-col w-full max-w-lg items-center gap-1.5">
        <Label htmlFor="picture">Image</Label>
        <div className="flex">
            <Input id="picture" type="file" onChange={handleFileChange}/>
            <Button 
              onClick={handleUpload} 
              disabled={loading}
              className="w-32"
              >
              {loading ? 'Uploading...' : "Upload"}
            </Button>   
        </div>
    </div>
  );
};

export default UploadComponent;