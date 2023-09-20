import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Editing from './components/pages/Editing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/creating' element={<Editing />} />
      </Routes>
    </Router>
  );
}

export default App;
