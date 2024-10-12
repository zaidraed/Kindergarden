import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { validateGoogleToken } from "./authSlice";

function GoogleAuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    if (token) {
      dispatch(validateGoogleToken(token))
        .unwrap()
        .then(() => {
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("Error validating Google token:", error);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, location]);

  return <div>Procesando inicio de sesión...</div>;
}

export default GoogleAuthCallback;
