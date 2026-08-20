import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Welcome from "./pages/onboarding/Welcome";
import ProfileSetup from "./pages/onboarding/ProfileSetup";
import CreateWorkspace from "./pages/onboarding/CreateWorkspace";
import CreateAdditionalWorkspace from "./pages/CreateAdditionalWorkspace";
import InviteTeam from "./pages/onboarding/InviteTeam";
import Dashboard from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding/welcome" element={<Welcome />} />
          <Route path="/onboarding/profile" element={<ProfileSetup />} />
          <Route path="/onboarding/workspace" element={<CreateWorkspace />} />
          <Route path="/onboarding/invite" element={<InviteTeam />} />
          <Route path="/workspace/new" element={<CreateAdditionalWorkspace />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
