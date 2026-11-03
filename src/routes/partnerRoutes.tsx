import React from "react";
import { Route, Routes } from "react-router-dom";
import PartnerLogin from "../pages/Partner/partnerLogin";
import PartnerDashboard from "../pages/Partner/partnerDashboard";
import NotFound from "../pages/NotFound/notFound";

const PartnerRoutes: React.FC = () => (
    <Routes>
        <Route path="/" element={<PartnerDashboard />} />
        <Route path="login" element={<PartnerLogin />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default PartnerRoutes;
