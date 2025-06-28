import type { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import EmailLayout from "../components/EmailLayout/EmailLayout";
import ProfilePage from "../components/profile/ProfilePage";
import ProtectedLayout from "../ProtectedLayout";

export const ROUTEPATHS = {
    LOGIN: "/",
    REGISTER: "/register",
    MAIL: "/mail",
    PROFILE: "/profile",
};

const Routing: FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path={ROUTEPATHS.LOGIN} element={<Login />} />
            <Route path={ROUTEPATHS.REGISTER} element={<Register />} />

            {/* Protected Routes with Header */}
            <Route element={<ProtectedLayout />}>
                <Route path={ROUTEPATHS.MAIL} element={<EmailLayout />} />
                <Route path={ROUTEPATHS.PROFILE} element={<ProfilePage />} />
            </Route>
        </Routes>
    );
};

export default Routing;
