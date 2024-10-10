import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import User from "./pages/user/user";
import Admin from "./pages/admin/admin";



function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<User />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
