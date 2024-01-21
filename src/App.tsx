import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import './index.css';

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/room/:id" element={<div>Room</div>} />
      <Route path="/" element={<div>Home</div>} />
      <Route path='*' element={<div>Not found</div>} />
    </Routes>
  </BrowserRouter>
);

function App() {
  return (
    <Root />
  )
}

export default App
