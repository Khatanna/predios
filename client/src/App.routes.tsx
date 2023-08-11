import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Navbar } from './components/Navbar';
import { User } from './pages/User';
import { useEffect } from 'react';
import { useAuth } from './hooks';

function App() {
  const { checkAuth } = useAuth();
  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Navbar}>
          <Route index Component={Home} />
          <Route path='/users'>
            <Route index Component={User} />
            <Route path='show/:username' Component={() => {
              const { username } = useParams();

              useEffect(() => {
                console.log({ username })
              }, [])

              return <div>{JSON.stringify(username)}</div>
            }} />
            <Route path='edit/:username' Component={() => {
              const { username } = useParams();

              useEffect(() => {
                console.log({ username })
              }, [])

              return <div>{JSON.stringify(username)}</div>
            }} />
          </Route>
        </Route>
        <Route path='/auth'>
          <Route index Component={Login} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
