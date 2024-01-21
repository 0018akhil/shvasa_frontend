import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import SupportAgent from "./pages/supportagent/supportagent.tsx";
import SupportTicket from "./pages/supportticket/supportticket.tsx";
import Tickets from "./pages/tickets/tickets.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="" element={<App />} />
        <Route path="/supportagent" element={<SupportAgent />} />
        <Route path="/supportticket" element={<SupportTicket />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="*" element={<Navigate replace to="" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
