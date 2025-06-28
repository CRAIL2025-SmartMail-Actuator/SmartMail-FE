import type { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";

export const ROUTEPATHS = {
    LOGIN: "/",
    REGISTER: "/register"
}

const Routing: FC = () => {
    return <>
        <Routes>
            <Route path={ROUTEPATHS.LOGIN} element={<Login />}></Route>
            <Route path={ROUTEPATHS.REGISTER} element={<Register />}></Route>
        </Routes>
    </>
}

export default Routing;