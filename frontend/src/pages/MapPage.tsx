import { FaHome } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useState } from "react";
import {
  CASHIER,
  CEIT_DEAN_OFFICE,
  COE,
  COOP,
  CPE_DEPT,
  CULTURAL_AFFAIRS_OFFICE,
  ENGR_BLDG,
  HighlightsProps,
  ITB,
  JVE,
  MAB,
  MIC,
  OB,
  OFFICE_PRESIDENT,
  REGISTRAR,
  RND,
  SCHOLARSHIP_AND_FINANCIAL_ASSISTANCE_UNIT,
  SNAGAH,
  STUDENT_AND_ALUMNI_AFFAIRS_SERVICES,
  WELLNESS,
} from "@/interface";
import BuildingComponent from "@/my_components/BuildingComponent";
import { getMapImage } from "@/api";
import RTU_MAP from "/RTU_MAP.jpg";

const MapPage = () => {
  const [title, setTitle] = useState("Rizal Technological University Map");
  const [isFloorSelected, setIsFloorSelected] = useState<boolean>(false);
  const [floor, setFloor] = useState<string>("");
  const [folder, setFolder] = useState("");
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
                  {/* {title === "Rizal Technological University Map" && <RtuMap />} */}
                  {/* TODO: Handle change background to show the floor plan */}

                  <img
                    src={isFloorSelected ? getMapImage(folder, floor) : RTU_MAP}
                    alt="Floor Plan"
                    className="object-contain h-full w-full"
                  />

                  <BuildingComponent
                    folder={JVE}
                    className="top-[140px] left-[465px] w-[165px] h-[370px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={ITB}
                    className="top-[180px] left-[641px] w-[240px] h-[170px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={WELLNESS}
                    className="top-[82.5%] left-[48.5%] w-[180px] h-[100px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={SNAGAH}
                    className="top-[10.5%] left-[78%] w-[147px] h-[225px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={OB}
                    className="top-[67%] left-[32%] w-[543px] h-[63px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={OB}
                    className="top-[45%] left-[68.25%] w-[61px] h-[333px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={OB}
                    className="top-[16%] left-[67%] w-[79px] h-[252px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={MAB}
                    className="top-[75%] left-[47%] w-[315px] h-[58.5px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={MAB}
                    className="top-[82%] left-[65.1%] w-[47px] h-[138px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={MAB}
                    className="top-[86%] left-[68.25%] w-[55px] h-[60px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={RND}
                    className="top-[15.5%] left-[73%] w-[75px] h-[344px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />
                  <BuildingComponent
                    folder={ENGR_BLDG}
                    className="top-[4%] left-[34%] w-[125px] h-[90px]"
                    setIsFloorSelected={(e) => setIsFloorSelected(e)}
                    getFolder={(folder) => setFolder(folder)}
                    getFloor={(floor) => setFloor(floor)}
                    disabled={isFloorSelected}
                  />

                  {/* Highlights */}
                  {!isFloorSelected && (
                    <Highlights
                      className="top-[21%] left-[1%]"
                      setIsFloorSelected={(e) => setIsFloorSelected(e)}
                      getFolder={(folder) => setFolder(folder)}
                      getFloor={(floor) => setFloor(floor)}
                    />
                  )}
                </div>
              </TransformComponent>
              <Button
                onClick={() => {
                  setTitle("Rizal Technological University Map");
                  resetTransform();
                  setIsFloorSelected(false);
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

const Highlights = ({
  className,
  getFloor,
  getFolder,
  setIsFloorSelected,
}: HighlightsProps) => {
  function handleClick(file: any) {
    setIsFloorSelected(true);
    getFolder(file.folder);
    getFloor(file.floor);
  }

  return (
    <div
      className={`absolute disabled:opacity-0 ${className} flex-col flex space-y-2`}
    >
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(MIC)}
      >{`Management Information Center (MIC)`}</Button>
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(CASHIER)}
      >
        Cashier
      </Button>
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(CPE_DEPT)}
      >
        Computer Engineering Department
      </Button>
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(COOP)}
      >
        COOP
      </Button>
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(OFFICE_PRESIDENT)}
      >
        Office of the President
      </Button>
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(REGISTRAR)}
      >
        Registrar's Office
      </Button>
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(SCHOLARSHIP_AND_FINANCIAL_ASSISTANCE_UNIT)}
      >
        Scholarship and Financial Assistance Unit
      </Button>
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(STUDENT_AND_ALUMNI_AFFAIRS_SERVICES)}
      >
        Student and Alumni Affairs Services Unit
      </Button>
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(CEIT_DEAN_OFFICE)}
      >
        CEIT Dean's Office
      </Button>
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(COE)}
      >{`Cooperative Education Office (COE)`}</Button>
      <Button
        variant={"outline"}
        className="h-13"
        onClick={() => handleClick(CULTURAL_AFFAIRS_OFFICE)}
      >
        Cultural Affairs Office
      </Button>
    </div>
  );
};

export default MapPage;
