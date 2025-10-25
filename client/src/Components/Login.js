import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useUserStore from "../store/userStore";
import { RiTwitterXFill } from "react-icons/ri";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, setUser } = useUserStore();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home/posts/allposts");
    }
  }, [isAuthenticated]);

  async function handleLogin() {
    const id = toast.loading("Trying to login...");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          name: username,
          email: email,
          password: password,
        }
      );

      console.log(response.data);
      toast.success("Login successful");

      const { token, username: userName, user_id } = response.data;
      setUser(userName, user_id);
      localStorage.setItem("token", token);
      navigate("/home/posts/allposts");
    } catch (err) {
      console.log(err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Some error occurred";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      toast.dismiss(id);
    }
  }

  return (
    <section className="flex items-center justify-center bg-[#000000] h-[100vh] w-[100vw]">
      <div className="mt-[12%] w-[400px]">
        <form
          className="p-[2rem] rounded-[5px] flex gap-[1rem] flex-col bg-[#000000] shadow-xl"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="flex items-center gap-2 pl-2">
            <p className="text-[35px] font-bold text-[#FFFFFF]">Sign in to</p>
            <RiTwitterXFill className="text-[35px] font-bold text-[#FFFFFF]" />
          </div>

          <input
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
            className="p-[0.6rem] outline-none w-full bg-gray-100 text-black border-[1.7px] border-[#333639] focus:border-[#0584C7] placeholder:text-gray-600 rounded-lg"
            required
          />

          <input
            placeholder="Enter Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-[0.6rem] outline-none w-full bg-gray-100 text-black border-[1.7px] border-[#333639] focus:border-[#0584C7] placeholder:text-gray-600 rounded-lg"
            required
          />

          <input
            placeholder="Enter Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-[0.6rem] outline-none w-full bg-gray-100 text-black border-[1.7px] border-[#333639] focus:border-[#0584C7] placeholder:text-gray-600 rounded-lg"
            required
          />

          <div>
            <Link
              to="/forget-password"
              className="text-[#0584C7] hover:underline"
            >
              Forget Password?
            </Link>
          </div>

          <p className="text-[#F9F1F1]">
            Don't have an Account?{" "}
            <span>
              <Link
                to="/signup"
                className="text-[#0584C7] font-semibold hover:underline"
              >
                Signup
              </Link>
            </span>
          </p>

          <button
            type="submit"
            className="p-2 bg-[#0584C7] hover:bg-[#0584C7]/70 text-white rounded-lg text-lg font-semibold"
          >
            Login
          </button>

          {error && <p className="text-red-500 text-sm">*{error}</p>}
        </form>
      </div>
    </section>
  );
}

export default Login;