import SearchData from "./components/SearchData";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for SearchData Component */}
        <Route path="/" element={<SearchData />} />
      </Routes>
    </Router>
  );
}

export default App;
