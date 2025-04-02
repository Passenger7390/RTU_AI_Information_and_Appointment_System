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
  onVerified: () => void;
}

const OTPDialog = ({ email, onVerified }: OTPDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [label, setLabel] = useState("Verify Email");

  const [isVerified, setIsVerified] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLabel("Sending OTP...");
    await sendOTP(email);
  };

  const handleVerifyEmail = async () => {
    // TODO: FIx the bug in the dialog

    const res = await verifyOTP(email, otp);
    console.log(res);
    if (res) {
      toast.success("Email verified successfully!");
      setLabel("Verified");
      setIsVerified(true);
      onVerified();
      setDialogOpen(false);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setLabel("Verify Email");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full text-lg"
          onClick={(e) => {
            // Prevent DialogTrigger from automatically opening dialog
            if (!email) {
              e.preventDefault();
              toast.error("Please enter a valid email address");
              return;
            }

            // If email exists, send OTP (dialog will open automatically)
            handleSendOTP();
          }}
          variant={"secondary"}
          // The button should not be disabled when the user changes the email
          disabled={isVerified}
        >
          {label}
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
