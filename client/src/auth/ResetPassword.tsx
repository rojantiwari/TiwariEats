import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const loading = false;

  return (
    <div className="flex items-center justify-center h-screen w-screen overflow-hidden">
      <form className="md:p-8 p-6 w-full md:w-[450px] rounded-xl md:border border-gray-200 mx-4">
        <div className="text-center m-2">
          <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600 m-4">
            Enter your new password to reset old one
          </p>
        </div>
        <div className="relative w-full m-2">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full h-12 pl-12 text-lg rounded-xl border-gray-300 focus-visible:ring-2"
          />

          <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
        </div>
        {loading ? (
          <Button disabled className="bg-orange hover:bg-hoverOrange">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button className="bg-orange hover:bg-hoverOrange m-2 w-full rounded-xl">
            Reset Password
          </Button>
        )}
        <div className="flex justify-center m-3">
          <span className="text-center mb-6">
            Back to{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
