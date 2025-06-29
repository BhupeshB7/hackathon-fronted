import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import NotFound from "./components/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import FileViewer from "./pages/FileViewer";
import Trash from "./pages/Trash";
import FileAnalyticsDashboard from "./pages/FileAnalyticsDashboard";
import RecentFiles from "./pages/RecentFiles";
import StarredFiles from "./pages/StarredFiles";

const App = () => {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="drive-theme">
        <Toaster richColors position="top-center" theme="system" />
        <Router>
          <AuthProvider>
            <main>
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="directory/:parentId" element={<Dashboard />} />
                  </Route>
                  <Route
                    path="/file/:fileId"
                    element={<FileViewer mode="private" />}
                  />
                  <Route
                    path="/view/:fileId"
                    element={<FileViewer mode="view" />}
                  />
                  {/* <Route path="/share/:fileId" element={<FileViewer />} /> */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/trash" element={<Trash />} />
                  <Route path="/recent" element={<RecentFiles />} />
                  <Route path="/starred" element={<StarredFiles />} />
                  <Route
                    path="/analytics"
                    element={<FileAnalyticsDashboard />}
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
