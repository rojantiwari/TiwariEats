import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginInputState, userLoginInputState } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Separator } from "@radix-ui/react-separator";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [input, setInput] = useState<loginInputState>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<loginInputState>>({});
  let { loading, login } = useUserStore();
  // const navigate = useNavigate();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const loginSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    const result = userLoginInputState.safeParse(input);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<loginInputState>);
      return;
    }

    try {
      await login(input);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen overflow-hidden">
      <form
        className="flex flex-col md:p-10 p-6 w-full md:w-[450px] bg-white shadow-lg rounded-xl border border-gray-200"
        onSubmit={loginSubmitHandler}
      >
        <div className="mb-6 text-center">
          <h1 className="font-bold text-3xl text-gray-800">Tiwari-Eats</h1>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="w-full h-12 pl-12 text-lg rounded-xl border-gray-300 focus-visible:ring-2"
            />
            <Mail
              className="absolute inset-y-3 left-3 text-gray-500"
              size={24}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="w-full h-12 pl-12 text-lg rounded-xl border-gray-300 focus-visible:ring-2"
            />
            <LockKeyhole
              className="absolute inset-y-3 left-3 text-gray-500"
              size={24}
            />
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}
          </div>
        </div>

        <div className="mb-6">
          {loading ? (
            <Button
              disabled
              className="w-full h-12 bg-orange hover:bg-hoverOrange"
            >
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full h-12 text-lg bg-orange rounded-xl hover:bg-hoverOrange"
            >
              Login
            </Button>
          )}
        </div>

        <div className="mb-6 text-center">
          <Link to="/forgetPassword" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Separator />

        <p className="text-center text-blue-500 mt-6 text-lg">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
