import { useEffect, useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { fetchImageFilename, getImage, ImageData } from "@/api";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
// const REFRESH_INTERVAL = 30000; // 30s econds in milliseconds

const AdCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState<ImageData[]>([]); // Change to store full ImageData
  const [currentDuration, setCurrentDuration] = useState(15);

  const loadImage = async () => {
    try {
      const res: ImageData[] = await fetchImageFilename();
      setImages(res); // Store complete ImageData objects
      if (res.length > 0) {
        setCurrentDuration(res[0].duration);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const hasFetchedAds = useRef(false);

  useEffect(() => {
    // This is a change listener for the carousel, if the user changed the iamge manually
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    // Update duration when current image changes
    if (images.length > 0) {
      setCurrentDuration(images[current].duration);
    }
  }, [current, images]);

  useEffect(() => {
    // This is a auto scroll timer, this will run according to the image duration set in the database
    const interval = setInterval(() => {
      if (api && images.length > 0) {
        const nextIndex = (current + 1) % images.length;
        api.scrollTo(nextIndex);
      }
    }, currentDuration * 1000); // Use current image's duration

    return () => clearInterval(interval);
  }, [api, current, images.length, currentDuration]);

  useEffect(() => {
    // This is a timer, this will run every 12 hours to fetch images
    loadImage();

    // Set up refresh interval
    const refreshInterval = setInterval(() => {
      loadImage();
    }, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (hasFetchedAds.current) return;

    // Initial load
    loadImage();

    // Set up refresh interval

    hasFetchedAds.current = true;

    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Carousel className="w-full h-full" setApi={setApi}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <AspectRatio
              ratio={4 / 3}
              className="bg-muted mx-auto w-full max-w-[1280px] max-h-[800px]"
            >
              <img
                src={getImage(image.filename)}
                alt={image.filename}
                className="w-full h-full object-contain"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default AdCarousel;
