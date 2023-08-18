import { BrowserRouter, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Navbar } from "./components/Navbar";
import { User } from "./pages/User";
import { useEffect } from "react";
import { useAuth } from "./hooks";
import Swal from "sweetalert2";
import { FormCreateUser } from "./pages/User/components/FormCreateUser";
import { Admin } from "./pages/Admin";
import { Usertype } from "./pages/User/components/Usertype";
import { UserList } from "./pages/User/components/UserList";

function App() {
  const { checkAuth } = useAuth();
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'f' || e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        console.log("buscar")
        Swal.fire({
          title: 'Indique el parametro de busqueda',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Buscar',
          cancelButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          preConfirm: (login) => {
            return login
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            // mostrar el predio con ese codigo
            Swal.fire({
              title: `Resultado de la busqueda`,
              text: result.value,
              confirmButtonText: 'Aceptar'
            })
          }
        })
      }
    }

    window.addEventListener('keydown', listener);

    checkAuth();

    return () => {
      window.removeEventListener('keydown', listener);
    }
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Navbar}>
          <Route index Component={Home} />
          <Route path="/users">
            <Route index Component={User} />
            <Route path="all" Component={UserList} />
            <Route path="create" Component={FormCreateUser} />
            <Route
              path="show/:username"
              Component={() => {
                const { username } = useParams();

                useEffect(() => {
                  console.log({ username });
                }, [username]);

                return <div>{JSON.stringify(username)}</div>;
              }}
            />
            <Route
              path="edit/:username"
              Component={() => {
                const { state } = useLocation()

                return <FormCreateUser user={state} />
              }}
            />
          </Route>
          <Route path="/admin">
            <Route index Component={Admin} />
            <Route path="usertype" Component={Usertype} />
          </Route>
        </Route>
        <Route path="/auth">
          <Route index Component={Login} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
