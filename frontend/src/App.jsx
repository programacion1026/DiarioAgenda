import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./componentes/login/login";
import Registro from "./componentes/registro/registro";
import Calendario from "./componentes/calendario/calendario";
import './app.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/calendario" element={<Calendario />} />
      </Routes>
    </Router>
  );
}

export default App;