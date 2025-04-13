import rtuMapImg from "/RTU_MAP.jpg";
import groundFloorImg from "/groundFloor.png";
import secondFloorImg from "/secondFloor.png";
import thirdFloorImg from "/thirdFloor.png";
import fourthFloorImg from "/fourthFloor.png";

export const RtuMap = () => {
  return (
    <div>
      <img
        src={rtuMapImg}
        alt="rtu map"
        className="object-contain h-full w-full"
      />
    </div>
  );
};
export const GroundFloor = () => {
  return (
    <div>
      <img
        src={groundFloorImg}
        alt="ground floor map"
        className="object-contain h-full w-full"
      />
    </div>
  );
};
export const SecondFloor = () => {
  return (
    <div>
      <img
        src={secondFloorImg}
        alt="second floor map"
        className="object-contain h-full w-full"
      />
    </div>
  );
};
export const ThirdFloor = () => {
  return (
    <div>
      <img
        src={thirdFloorImg}
        alt="third floor map"
        className="object-contain h-full w-full"
      />
    </div>
  );
};
export const FourthFloor = () => {
  return (
    <div>
      <img
        src={fourthFloorImg}
        alt="fourth floor map"
        className="object-contain h-full w-full"
      />
    </div>
  );
};
