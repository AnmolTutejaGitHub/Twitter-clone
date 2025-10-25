import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';

function GetVerified() {
  const [email,setEmail] = useState("");
  const token = localStorage.getItem("token");

  async function sendVerfificationEmail(){
    const id = toast.loading("sending verfication mail");
    try{
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/generate-Verification-Token`,
            {email},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
    toast.success("check your inbox");
    }catch(err){
        toast.error(err.response?.data?.message || err.response?.data?.error || "error sending mail");
    }finally{
        toast.dismiss(id);
    }
  }
  return (
      <section className="h-[100vh] w-[100vw] flex items-center justify-center bg-[#000000]">
        <fieldset className="rounded-xl w-[30rem] h-[24rem] p-8 shadow-xl bg-[#000000]">
          <legend className="text-2xl font-bold text-[#0584C7] mb-6">
            Get Verified
          </legend>

          <p className="text-lg text-[#F9F1F1] mb-4">
            Enter your email to get verified.
          </p>

          <label className="block text-lg font-medium text-[#F9F1F1]">Email</label>
          <input
            type="email"
            className="input input-bordered w-full mt-1 rounded-lg bg-gray-100 text-black p-2"
            placeholder="Enter your email"
            onChange={(e)=>setEmail(e.target.value)}
          />

          <button className="btn mt-6 w-full bg-[#0584C7] hover:bg-[#0584C7]/70 text-white rounded-lg text-lg font-semibold p-2"
          onClick={sendVerfificationEmail}>
            Send Verification Token
          </button>

          <div className="text-lg text-[#F9F1F1] mt-6 text-center">
            Already verified?{" "}
            <Link
              to="/login"
              className="text-[#F75904]/60 text-[#0584C7] font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </fieldset>
      </section>
  );
}

export default GetVerified;