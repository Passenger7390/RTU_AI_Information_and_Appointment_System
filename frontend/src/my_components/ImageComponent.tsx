import rtuMapImg from "/RTU_MAP.jpg";

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
