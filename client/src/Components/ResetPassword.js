import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function ResetPassword() {
  const { token } = useParams();
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  async function handleResetPassword() {
    const toastId = toast.loading("Updating your password...");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/resetPassword/${token}`,{
        password :password, 
        confirm_password: confirmPassword 
        })
      toast.success(response.data?.message || "Password updated successfully!");
    } catch (err) {
        console.log(err);
      toast.error(err.response?.data?.error || err.response?.data?.message ||  err.response?.data || "Failed to update password");
    } finally {
      toast.dismiss(toastId);
    }
  }

  return (
      <section className="w-[100vw] h-[100vh] flex items-center justify-center bg-[#000000]">
        <fieldset className="rounded-xl w-[30rem] h-[30rem] p-8 shadow-xl bg-[#000000]">
          <legend className="text-2xl font-bold text-[#FFFFFF] mb-6">
            Reset Password
          </legend>

          <label className="block text-lg font-medium text-[#F9F1F1]">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full mt-1 rounded-lg bg-gray-100 text-black p-2"
            placeholder="Enter new password"
          />

          <label className="block text-lg font-medium text-[#F9F1F1] mt-6">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input input-bordered w-full mt-1 rounded-lg bg-gray-100 text-black p-2"
            placeholder="Confirm new password"
          />

          <button
            onClick={handleResetPassword}
            className="btn mt-8 w-full bg-[#0584C7] hover:bg-[#0584C7]/70 text-white rounded-lg text-lg font-semibold p-2"
          >
            Update Password
          </button>

          <p className="text-lg text-[#F9F1F1] mt-6 text-center">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-[#F75904]/60 text-[#0584C7] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </fieldset>
      </section>
  );
}

export default ResetPassword;