import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Navbar } from './components/Navbar';
import { User } from './pages/User';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navbar />}>
          <Route index Component={Home} />
          <Route path='users' Component={User} />
        </Route>
        <Route path='/auth'>
          <Route index Component={Login} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
