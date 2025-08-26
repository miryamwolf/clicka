import { Route, Routes } from "react-router-dom";
import { EmailTemplateTable } from "./ShowAllEmailTemplates";

export const EmailTemplateRouting = () => {
    return (
        <Routes>
            <Route path="/" element={<EmailTemplateTable />} />
        </Routes>
    );
};
