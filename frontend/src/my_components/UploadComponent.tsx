import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      setLoading(true);
      await uploadFile(file);
      // TODO: Do a toast in here
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return <div>sdf</div>;
};

export default UploadComponent;
