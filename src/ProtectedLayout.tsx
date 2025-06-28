import { Outlet, useNavigate } from "react-router-dom";
import { ROUTEPATHS } from "./routing";
import Header from "./components/EmailLayout/Header/Header";

const ProtectedLayout = () => {
  // Optional: add auth check logic here (e.g., token in localStorage)
  // If unauthenticated → redirect

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header
        userEmail="lanirudh@45.com"
        onLogout={() => {
          localStorage.clear();
          useNavigate()(ROUTEPATHS.LOGIN);
        }}
      />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
