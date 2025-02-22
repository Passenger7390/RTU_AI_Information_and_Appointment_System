import { useEffect, useState, useRef } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { fetchAds, getImage } from '@/api';
const AdCarousel = () => {
  const hasFetchedAds = useRef(false)

  const [images, setImages] = useState<string[]>([])
  useEffect(() => {
    if (hasFetchedAds.current) return;

    const loadImage = async () => {
      const imageUrl = await fetchAds()
      setImages(imageUrl)
    }
    loadImage()

    hasFetchedAds.current = true

    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Cleanup function to re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // TODO: Add loading spinner
  // TODO: Add API to automatically scroll through images

  return (
    <Carousel className="w-full h-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <img src={getImage(image)} alt={image} className='w-screen h-screen object-contain'/>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default AdCarousel