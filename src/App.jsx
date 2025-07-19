import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import PostCard from "./components/PostCard";
import AddNewPost from "./components/AddNewPost";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";

export default function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Navbar />
      <div className="bg-white bg-gradient-to-b from-lightest-beige via-light-beige via-dark-beige to-darkest-beige min-h-screen p-8">
        {user && (
          <NavLink to={"/add-post"}>
            <button
              onClick={() => navigator}
              className="fixed bottom-6 right-6 bg-dark-red hover:bg-light-red text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg cursor-pointer z-1"
              title="Add Post"
            >
              +
            </button>
          </NavLink>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/add-post" element={<AddNewPost />} />{" "}
          {/* For adding new post */}
          <Route path="/add-post/:postId" element={<AddNewPost />} />{" "}
          {/* For editing existing post */}
        </Routes>
      </div>
    </>
  );
}
