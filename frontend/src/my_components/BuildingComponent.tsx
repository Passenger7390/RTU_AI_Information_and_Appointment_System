import { getBuildingFloors } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BuildingComponentProps } from "@/interface";
import { useEffect, useState } from "react";

const BuildingComponent = ({
  folder,
  className,
  getFolder,
  getFloor,
  setIsFloorSelected,
}: BuildingComponentProps) => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buildingName, setBuildingName] = useState("");
  const [isDialogVisible, setDialogVisible] = useState(false);

  function setFloorInfo(floor: string) {
    setIsFloorSelected(true);
    getFolder(folder);
    getFloor(floor);
    setDialogVisible(false);
  }

  async function getBuildingInfo() {
    try {
      setLoading(true);
      const res = await getBuildingFloors(folder);

      // Safely handle the response data
      if (res && Array.isArray(res.images)) {
        setBuildingName(res.building_name);
        setFloors(res.images);
      } else {
        console.error("Invalid image_files format for", folder);
        setFloors([]);
      }
    } catch (error) {
      console.error("Error fetching building floors:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBuildingInfo();
  }, [folder]);

  return (
    <Dialog
      open={isDialogVisible}
      onOpenChange={(open) => setDialogVisible(open)}
    >
      <DialogTrigger asChild>
        <Button className={`absolute ${className}`} />
      </DialogTrigger>
      <DialogContent className="min-w-[fit-content] min-h-[fit-content] w-full max-w-[1900px]">
        <DialogHeader>
          <DialogTitle className="text-3xl mx-auto">{buildingName}</DialogTitle>
          <DialogDescription className="mx-auto">
            Choose a floor to view
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-y-5 gap-x-5 p-5">
          {loading ? (
            <div className="col-span-2 text-center p-5">
              Loading floor plans...
            </div>
          ) : floors.length > 0 ? (
            floors.map((floor, index) => (
              // <img
              //   key={index}
              //   src={getMapImage(folder, floor)}
              //   alt={`Floor ${index + 1}`}
              // />
              <Button
                key={floor}
                className="w-full h-full"
                variant="outline"
                onClick={() => setFloorInfo(floor)}
              >{`Floor ${index + 1}`}</Button>
            ))
          ) : (
            <div className="col-span-2 text-center p-5">
              No floor plans available for this building
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingComponent;
