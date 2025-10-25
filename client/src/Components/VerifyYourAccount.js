import { useParams ,useNavigate} from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function VerifyYourAccount() {
  const { token } = useParams();
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    const toastId = toast.loading("Verifying your account...");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/verify/${token}`,
      )
      toast.success(response?.data?.message || "Account verified!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Verification failed");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  return (
      <section className="h-[100vh] w-[100vw] flex items-center justify-center bg-[#000000]">
        <fieldset className="rounded-xl w-[30rem] h-[18rem] p-8 shadow-xl bg-[#000000]">
          <legend className="text-2xl font-bold text-[#0584C7] mb-6">
            Verify Your Account
          </legend>

          <p className="text-lg text-[#F9F1F1] mb-4">
            Click the button below to verify your account.
          </p>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="btn mt-6 w-full  bg-[#0584C7] hover:bg-[#0584C7]/70 text-white rounded-lg text-lg font-semibold disabled:opacity-50 p-2"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </fieldset>
      </section>
  );
}

export default VerifyYourAccount;