import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { sendOTP, verifyOTP } from "@/api";
import toast from "react-hot-toast";
interface OTPDialogProps {
  email: string;
}

const OTPDialog = ({ email }: OTPDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSendOTP = async () => {
    await sendOTP(email);
  };

  const handleVerifyEmail = async () => {
    // TODO: This is working bug there is a bug in toast
    // TODO: FIx the bug in the dialog

    const res = await verifyOTP(email, otp);
    console.log(res);
    if (res) {
      toast.success("Email verified successfully!");
      setDialogOpen(false);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button className="w-full text-xl" onClick={handleSendOTP}>
          Verify
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Enter the OTP sent to your email
          </DialogTitle>
          <DialogDescription className="text-center">
            We've sent a 6-digit verification code to verify your email address.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center py-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <DialogFooter className="flex justify-end gap-2 pt-2">
          <Button variant={"outline"} onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleVerifyEmail}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OTPDialog;
