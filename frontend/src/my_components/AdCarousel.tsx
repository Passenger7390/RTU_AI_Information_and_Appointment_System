import { useEffect, useState, useRef } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import { fetchImageFilename, getImage } from '@/api';

const AdCarousel = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const hasFetchedAds = useRef(false)
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    const interval = setInterval(() => {
      if (api) {
        const nextIndex = (current + 1) % images.length
        api.scrollTo(nextIndex)
      }
    }, 15000) // 15 seconds

    return () => clearInterval(interval)
  }, [api, current, images.length])

  useEffect(() => {
    if (hasFetchedAds.current) return;

    const loadImage = async () => {
      const imageUrl = await fetchImageFilename()
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

  return (
    <Carousel className="w-full h-full" setApi={setApi}>
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