import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import Main from './pages/Main';
import Room from './pages/Room';
import NotFound from './pages/NotFound';
import JoinRoom from './pages/JoinRoom';

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/rooms/:id" element={<Room />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

function App() {
  return (
    <Root />
  )
}

export default App
