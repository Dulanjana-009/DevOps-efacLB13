import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import BorrowReturn from "./pages/BorrowReturn";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/books" element={<Books />} />
            <Route path="/books/add" element={<AddBook />} />

            <Route path="/members" element={<Members />} />
            <Route path="/members/add" element={<AddMember />} />

            <Route path="/borrow-return" element={<BorrowReturn />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;