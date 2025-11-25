import type { FC } from "react";
import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home";
import CharacterDetail from "../pages/CharacterDetail.tsx";

export const AppRouter: FC = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/character/:id" element={<CharacterDetail />} />
    </Routes>
)
