import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AxiosProvider } from "./context/AxiosContext";
import { ActivityPage } from "./pages/ActivityPage";
import { AdminPage } from "./pages/AdminPage";
import { BeneficiaryPage } from "./pages/BeneficiaryPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PermissionPage } from "./pages/PermissionPage";
import { FormCreatePermission } from "./pages/PermissionPage/components/FormCreatePermission";
import { PropertyPage } from "./pages/PropertyPage";
import { RecordPage } from "./pages/RecordPage";
import { FormCreateUser } from "./pages/UserPage/components/FormCreateUser";
import { Permission } from "./pages/UserPage/components/Permission";
import { UserList } from "./pages/UserPage/components/UserList";

function App() {
  return (
    <BrowserRouter >
      <AxiosProvider>
        <Routes>
          <Route path="/" Component={Navbar}>
            <Route index Component={HomePage} />
            <Route path="/users">
              <Route path="all" Component={UserList} />
              <Route path="create" Component={FormCreateUser} />
              <Route
                path="edit"
                Component={() => {
                  const { state } = useLocation()

                  return <FormCreateUser user={state} />
                }}
              />
              <Route path="permissions" Component={Permission}>
              </Route>
            </Route>
            <Route path="/admin">
              <Route index Component={AdminPage} />
              <Route path="records" Component={RecordPage} />
              <Route path="permissions">
                <Route path="all" Component={PermissionPage} />
                <Route path="create" Component={FormCreatePermission} />
                <Route path="edit" Component={() => {
                  const { state } = useLocation()

                  return <FormCreatePermission permission={state} />
                }}></Route>
              </Route>
              <Route path="properties" Component={PropertyPage} />
              <Route path="activities" Component={ActivityPage} />
              <Route path="beneficiaries" Component={BeneficiaryPage} />
            </Route>
          </Route>
          <Route path="/auth">
            <Route index Component={LoginPage} />
          </Route>

          <Route path="*" Component={NotFoundPage}></Route>
        </Routes>
      </AxiosProvider >
    </BrowserRouter >
  );
}

export default App;
