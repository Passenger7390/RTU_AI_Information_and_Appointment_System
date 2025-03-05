import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { MdOutlineDeleteForever } from "react-icons/md";

interface DeleteDialogProps {
  onConfirm?: () => void;
  isButtonDisabled?: boolean;
}

const DeleteDialog = ({ onConfirm, isButtonDisabled }: DeleteDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    if (onConfirm) {
      onConfirm();
      toast.success("Item/s deleted successfully!");
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={isButtonDisabled}>
          <MdOutlineDeleteForever className="size-7" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete?</DialogTitle>
          <DialogDescription className="text-lg">
            Are you sure you want to delete this item/s?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2"></div>
        </div>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
