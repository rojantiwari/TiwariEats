import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const loading: boolean = false;

  return (
    <div className="flex items-center justify-center h-screen w-screen overflow-hidden rounded-xl">
      <form className="md:p-8 p-6 w-full md:w-[450px] rounded-xl md:border border-gray-200 mx-4 ">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Forgot Password</h1>
          <p className="text-sm text-gray-600">
            Enter your email address to reset your password
          </p>
        </div>
        <div className="relative w-full mt-2">
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-10 rounded-xl"
          />
          <Mail className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
        </div>
        {loading ? (
          <Button disabled className="bg-orange hover:bg-hoverOrange">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button className="bg-orange hover:bg-hoverOrange mt-3 w-full rounded-xl mb-3">
            Send Reset Link
          </Button>
        )}
        <br />
        <span className="text-center">
          Back to{" "}
          <Link to="/login" className="text-blue-500 mt-3">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default ForgotPassword;
