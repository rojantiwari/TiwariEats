import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupInputState, userSignupSchema } from "@/schema/userSchema";
import { Separator } from "@radix-ui/react-separator";
import { Loader2, LockKeyhole, Mail, PhoneOutgoing, User } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";

//typescript - 2 ways to define types
// interface LoginInputState {
//   email: string;
//   password: string;
// }
// interface LoginWithAge extends LoginInputState {
//   age: string;
// }

// type signupInputState = {
//   fullname: string;
//   email: string;
//   password: string;
//   contact: string;
// };

function Signup() {
  const [input, setInput] = useState<signupInputState>({
    fullname: "",
    email: "",
    password: "",
    contact: "",
  });

  const [errors, setErrors] = useState<Partial<signupInputState>>({});

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const signupSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    // form validation check start

    const result = userSignupSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<signupInputState>);
      return;
    }

    //signup api implementations

    console.log(input);

    setInput({
      fullname: "",
      email: "",
      password: "",
      contact: "",
    });
  };

  const loading = false;

  return (
    <div className="flex items-center justify-center h-screen w-screen overflow-hidden ">
      <form
        className="md:p-8 p-6 w-full md:w-[450px] rounded-xl md:border border-gray-200 mx-4"
        onSubmit={signupSubmitHandler}
      >
        <div className="mb-6 text-center">
          <h1 className="font-bold text-3xl">Tiwari-Eats</h1>
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Full Name"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              className="w-full h-12 pl-12 text-lg rounded-xl focus-visible:ring-2"
            />
            <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            {errors && (
              <span className="text-xs text-red-500">{errors.fullname}</span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="w-full h-12 pl-12 text-lg rounded-xl focus-visible:ring-2"
            />
            <Mail
              className="absolute inset-y-3 left-3 text-gray-500"
              size={24}
            />
            {errors && (
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
              className="w-full h-12 pl-12 text-lg rounded-xl focus-visible:ring-2"
            />
            <LockKeyhole
              className="absolute inset-y-3 left-3 text-gray-500"
              size={24}
            />
            {errors && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Contact"
              name="contact"
              value={input.contact}
              onChange={changeEventHandler}
              className="w-full h-12 pl-12 text-lg rounded-xl focus-visible:ring-2"
            />
            <PhoneOutgoing className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            {errors && (
              <span className="text-xs text-red-500">{errors.contact}</span>
            )}
          </div>
        </div>

        <div className="mb-8">
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
              Signup
            </Button>
          )}
        </div>

        <Separator />

        <p className="text-center text-blue-500 mt-6 text-lg">
          Already have an account?{" "}
          <Link to="/login" className="font-bold ml-2">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
