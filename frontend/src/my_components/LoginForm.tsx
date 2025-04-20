import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  login,
  sendOTPToResetPassword,
  verifyOTP,
  resetPasswordAPI,
} from "@/api";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [resetPassword, setResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [enterOTP, setEnterOTP] = useState(false);

  const [isVerified, setIsVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function verifyPassword() {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    try {
      await resetPasswordAPI(resetEmail, newPassword);
      toast.success("Password reset successfully");
      setResetPassword(false);
      setEnterOTP(false);
      setIsVerified(false);
      setOtp("");
      setResetEmail("");
    } catch (error) {
      toast.error("Failed to reset password");
      console.error(error);
    }
    return true;
  }

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);

  const handleSubmit = async () => {
    if (username === "" || password === "") {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  async function handleResetPassword() {
    if (resetEmail === "") {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      // Call the API to send the OTP
      // await sendOtp(resetEmail);
      await sendOTPToResetPassword(resetEmail);
      setResetPassword(false);
      toast.success("OTP sent to your email");
      setEnterOTP(true);
    } catch (error) {
      toast.error("Failed to send OTP");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    try {
      setLoading(true);
      await verifyOTP(resetEmail, otp);
      toast.success("OTP verified successfully");
      setIsVerified(true);
      setOtp("");
    } catch (error) {
      toast.error("Invalid OTP");
      console.error(error);
      setOtp("");
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        {isVerified ? (
          <>
            <CardTitle className="text-3xl font-semibold">
              Assign New Password
            </CardTitle>
          </>
        ) : resetPassword ? (
          <>
            <CardTitle className="text-3xl font-semibold">
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </>
        ) : enterOTP ? (
          <>
            <CardTitle className="text-3xl font-semibold">Enter OTP</CardTitle>
            <CardDescription>Enter the OTP sent to your email</CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-3xl font-semibold">Login</CardTitle>
            <CardDescription>
              Enter your username and password to login to your account
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {isVerified ? (
          <div className="space-y-4 flex-col flex">
            <Label>New Password</Label>
            <div className="flex">
              <Input
                type={showNewPassword ? "text" : "password"}
                onChange={(e) => setNewPassword(e.target.value)}
              ></Input>
              <Button
                onClick={() => setShowNewPassword(!showNewPassword)}
                variant={"ghost"}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            <Label>Confirm Password</Label>
            <div className="flex">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Input>
              <Button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                variant={"ghost"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>
        ) : resetPassword ? (
          <>
            <Label htmlFor="username-label">Email</Label>
            <Input
              id="username"
              value={resetEmail}
              required
              onChange={(e) => setResetEmail(e.target.value)}
            ></Input>
          </>
        ) : enterOTP ? (
          <>
            <Label htmlFor="otp-label">OTP</Label>
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
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username-label">Username</Label>
                <Input
                  id="username"
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                ></Input>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password-label">Password</Label>
                <div className="flex">
                  <Input
                    id="password"
                    value={password}
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  ></Input>
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    variant={"ghost"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
            </div>
            {error && <Label className="text-red-600">{error}</Label>}
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {isVerified ? (
          <div className="flex justify-between gap-4">
            {" "}
            <Button
              onClick={() => {
                setResetPassword(false);
                setLoading(false);
                setEnterOTP(false);
                setIsVerified(false);
                setOtp("");
                setResetEmail("");
              }}
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button onClick={verifyPassword}>Create New Password</Button>
          </div>
        ) : resetPassword ? (
          <div className="flex justify-between gap-4">
            <Button
              onClick={() => {
                setResetPassword(false);
                setLoading(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>Send OTP</Button>
          </div>
        ) : enterOTP ? (
          <div className="flex justify-between gap-4">
            <Button
              onClick={() => {
                setEnterOTP(false);
                setLoading(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleVerifyOTP}>Verify</Button>
          </div>
        ) : (
          <>
            <Button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full"
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
            <Separator />
            <Button variant={"ghost"} onClick={() => setResetPassword(true)}>
              Reset Password
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
