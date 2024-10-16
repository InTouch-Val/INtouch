import { redirect } from "react-router-dom";
import { useAuth } from "../../service/authContext";

 const metricsPageLoader = async () => {
    const { currentUser } = useAuth();
    const AUTH_EMAIL = "v.y.maklakova@gmail.com";
  
    if (currentUser?.email !== AUTH_EMAIL) {
      return redirect("/");
    }
    return null;
  };

  export default metricsPageLoader;