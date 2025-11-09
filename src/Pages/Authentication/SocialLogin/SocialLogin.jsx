import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../Hooks/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import useSaveUser from "../../../Hooks/useSaveUser";

const SocialLogin = () => {
  const saveUser = useSaveUser();
  const { handleGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from || "/";
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await handleGoogle();
      const userEmail = result.user.email;
      await saveUser(userEmail);
      toast.success("Login Success");
      navigate(from);
    } catch (err) {
      toast.error(err?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center flex-col items-center">
      <h4 className="text-xl font-semibold">Or</h4>
      <button
        disabled={loading === true}
        onClick={handleGoogleLogin}
        className="flex text-xl btn btn-outline items-center gap-x-2"
      >
        {loading ? (
          "loading..."
        ) : (
          <>
            Google{" "}
            <span>
              <FcGoogle size={24} />
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default SocialLogin;
