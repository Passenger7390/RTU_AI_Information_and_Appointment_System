import { Button } from "@/components/ui/button";
import { IoMdHelpCircleOutline } from "react-icons/io";

const HelpComponent = () => {
  return (
    <Button className="mx-auto size-18 p-4" variant={"ghost"}>
      <IoMdHelpCircleOutline className="size-12" />
    </Button>
  );
};

export default HelpComponent;
