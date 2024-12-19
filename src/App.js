import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import User from "./pages/user/user";
import Admin from "./pages/admin/admin";
import PrivateRoute from "./../src/components/admin/protected/ProtectedRoute";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<User />} />
          <Route path="/admin/*" element={
            <PrivateRoute requiredRoles={["ROLE_ADMIN", "ROLE_SUPERADMIN", "ROLE_STAFF"]}>
              <Admin />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

 