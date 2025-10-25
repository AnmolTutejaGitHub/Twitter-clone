import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiTwitterXFill } from "react-icons/ri";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup() {
    const id = toast.loading("Creating your account...");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/signup`,
        {
          name: username,
          email: email,
          password: password,
          confirm_password: confirm_password,
        }
      );

      const data = response.data;
      console.log(data);
      localStorage.setItem("token",data.token);
      toast.success("Signup successful!");
      navigate("/verify");
    } catch (err) {
      console.log(err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        "Some error occurred";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      toast.dismiss(id);
    }
  }

  return (
    <section className="flex items-center justify-center bg-[#000000] h-[100vh] w-[100vw]">
      <div className="mt-[8%] w-[400px]">
        <form
          className="p-[2rem] rounded-[5px] flex gap-[1rem] flex-col bg-[#000000] shadow-xl"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <div className="flex items-center gap-2 pl-2">
            <p className="text-[35px] font-bold text-[#FFFFFF]">Join</p>
            <RiTwitterXFill className="text-[35px] font-bold text-[#FFFFFF]" />
          </div>

          <input
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
            className="p-[0.6rem] outline-none w-full bg-gray-100 text-black border-[1.7px] border-[#333639] focus:border-[##0584C7] placeholder:text-gray-600 rounded-lg"
            required
          />
          <input
            placeholder="Enter Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-[0.6rem] outline-none w-full bg-gray-100 text-black border-[1.7px] border-[#333639] focus:border-[##0584C7] placeholder:text-gray-600 rounded-lg"
            required
          />
          <input
            placeholder="Enter Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-[0.6rem] outline-none w-full bg-gray-100 text-black border-[1.7px] border-[#333639] focus:border-[##0584C7] placeholder:text-gray-600 rounded-lg"
            required
          />
          <input
            placeholder="Confirm Password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-[0.6rem] outline-none w-full bg-gray-100 text-black border-[1.7px] border-[#333639] focus:border-[##0584C7] placeholder:text-gray-600 rounded-lg"
            required
          />

          <p className="text-[#F9F1F1]">
            Already have an Account?{" "}
            <span>
              <Link
                to="/login"
                className="text-[#0584C7] font-semibold hover:underline"
              >
                Login
              </Link>
            </span>
          </p>

          <button
            type="submit"
            className="p-2 bg-[#0584C7] hover:bg-[#0584C7]/70 text-white rounded-lg text-lg font-semibold"
          >
            Sign Up
          </button>

          {error && <p className="text-red-500 text-sm">*{error}</p>}
        </form>
      </div>
    </section>
  );
}

export default Signup;
