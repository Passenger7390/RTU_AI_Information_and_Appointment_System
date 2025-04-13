import { FaHome } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { RtuMap } from "@/my_components/ImageComponent";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useState } from "react";
import { ITB, JVE, MAB, OB, SNAGAH, WELLNESS } from "@/interface";
import BuildingComponent from "@/my_components/BuildingComponent";

const MapPage = () => {
  const [title, setTitle] = useState("Rizal Technological University Map");

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
                  {title === "Rizal Technological University Map" && <RtuMap />}
                  {/* TODO: Handle change background to show the floor plan */}
                  <BuildingComponent
                    folder={JVE}
                    className="top-[140px] left-[465px] opacity-0 w-[165px] h-[370px]"
                  />
                  <BuildingComponent
                    folder={ITB}
                    className="top-[180px] left-[641px] w-[240px] h-[170px] opacity-0"
                  />
                  <BuildingComponent
                    folder={WELLNESS}
                    className="top-[82.5%] left-[48.5%] w-[180px] h-[100px] opacity-0"
                  />
                  <BuildingComponent
                    folder={SNAGAH}
                    className="top-[10.5%] left-[78%] w-[147px] h-[225px] opacity-0"
                  />
                  {/* OB Building */}
                  <BuildingComponent
                    folder={OB}
                    className="top-[67%] left-[32%] w-[543px] h-[63px] opacity-0"
                  />
                  <BuildingComponent
                    folder={OB}
                    className="top-[45%] left-[68.25%] w-[61px] h-[333px] opacity-0"
                  />
                  <BuildingComponent
                    folder={OB}
                    className="top-[16%] left-[67%] w-[79px] h-[252px] opacity-0"
                  />
                  <BuildingComponent
                    folder={MAB}
                    className="top-[75%] left-[47%] w-[315px] h-[58.5px] opacity-0"
                  />
                  <BuildingComponent
                    folder={MAB}
                    className="top-[82%] left-[65.1%] w-[47px] h-[138px] opacity-0"
                  />
                  <BuildingComponent
                    folder={MAB}
                    className="top-[86%] left-[68.25%] w-[55px] h-[60px] opacity-0"
                  />
                </div>
              </TransformComponent>
              <Button
                onClick={() => {
                  setTitle("Rizal Technological University Map");
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

export default MapPage;
