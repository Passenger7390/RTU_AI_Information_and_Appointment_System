import { FaHome } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  RtuMap,
  GroundFloor,
  SecondFloor,
  ThirdFloor,
  FourthFloor,
} from "@/my_components/ImageComponent";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const MapPage = () => {
  const [title, setTitle] = useState("Rizal Technological University Map");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trigger, setTrigger] = useState(false);
  return (
    <div className="flex-col justify-center items-center mx-auto p-5 bg-sky-950 container min-h-screen p-y-5">
      {/* <Button>Building A</Button> */}
      <div className="flex justify-center p-5">
        <h1 className="mx-auto text-4xl font-bold">{title}</h1>
      </div>
      <div className="w-full h-[80vh] bg-gray-800 rounded-lg shadow-lg">
        <TransformWrapper
          initialScale={1}
          minScale={0.3}
          maxScale={6}
          centerOnInit={true}
          limitToBounds={false}
          doubleClick={{ disabled: false }}
          panning={{ velocityDisabled: false }}
          alignmentAnimation={{ sizeX: 2, sizeY: 2 }} // Better animation values
          centerZoomedOut={true}
        >
          {({ resetTransform }) => (
            <>
              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                }}
                contentStyle={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="flex justify-center items-center h-full w-full">
                  {/* Your map content */}
                  {title === "Rizal Technological University Map" ? (
                    <RtuMap />
                  ) : title === "JVE ITC Ground Floor" ? (
                    <GroundFloor />
                  ) : title === "JVE ITC Second Floor" ? (
                    <SecondFloor />
                  ) : title === "JVE ITC Third Floor" ? (
                    <ThirdFloor />
                  ) : title === "JVE ITC Fourth Floor" ? (
                    <FourthFloor />
                  ) : (
                    <RtuMap />
                  )}

                  <BuildingDialog
                    props="absolute top-[140px] left-[465px] opacity-0 w-[165px] h-[370px]"
                    setTitle={setTitle}
                    open={dialogOpen}
                    setOpen={setDialogOpen}
                    setTrigger={setTrigger}
                    trigger={trigger}
                  />
                </div>
              </TransformComponent>
              <Button
                onClick={() => {
                  setTitle("Rizal Technological University Map");
                  setDialogOpen(false);
                  setTrigger(false);
                  resetTransform();
                }}
                className="mx-auto size-24 flex"
                size="icon"
                variant="outline"
              >
                <FaHome className="size-10" />
              </Button>
            </>
          )}
        </TransformWrapper>
      </div>
      <div className="flex"></div>
    </div>
  );
};

interface buildingDialogProps {
  props: string;
  setTitle: (title: string) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
}

const BuildingDialog = ({
  props,
  setTitle,
  setOpen,
  open,
  setTrigger,
  trigger,
}: buildingDialogProps) => {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <Button
          className={`${props} disabled:opacity-0`}
          onClick={() => setOpen(true)}
          disabled={trigger}
        />
      </DialogTrigger>
      <DialogContent className="min-w-[fit-content] min-h-[fit-content] w-full max-w-[1900px]">
        <DialogHeader>
          <DialogTitle className="text-3xl mx-auto">Choose floor</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-y-5 gap-x-5 p-5">
          <Button
            className="w-[425px] h-[200px] min-w-[fit-content] min-h-[fit-content]"
            onClick={() => {
              setTitle("JVE ITC Ground Floor");
              setOpen(false);
              setTrigger(true);
            }}
          >
            <GroundFloor />
          </Button>
          <Button
            className="w-[425px] h-[200px] min-w-[fit-content] min-h-[fit-content]"
            onClick={() => {
              setTitle("JVE ITC Second Floor");
              setOpen(false);
              setTrigger(true);
            }}
          >
            <SecondFloor />
          </Button>
          <Button
            className="w-[425px] h-[200px] min-w-[fit-content] min-h-[fit-content]"
            onClick={() => {
              setTitle("JVE ITC Third Floor");
              setOpen(false);
              setTrigger(true);
            }}
          >
            <ThirdFloor />
          </Button>
          <Button
            className="w-[425px] h-[200px] min-w-[fit-content] min-h-[fit-content]"
            onClick={() => {
              setTitle("JVE ITC Fourth Floor");
              setOpen(false);
              setTrigger(true);
            }}
          >
            <FourthFloor />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapPage;
