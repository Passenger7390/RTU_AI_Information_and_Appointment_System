// import { AspectRatio } from "@/components/ui/aspect-ratio"
import AdCarousel from "@/my_components/AdCarousel"
import { useEffect } from 'react'

const AdPage = () => {
  
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Cleanup function to re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  // const googleDrive = `https://drive.google.com/thumbnail?id=${file_id}`
  return (
    <div className="flex justify-center items-center h-screen w-screen">

        <AdCarousel />

    </div>
  )
}

export default AdPage