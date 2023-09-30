import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AxiosProvider } from "./context/AxiosContext";
import { LoginPage } from "./pages/LoginPage";
import { FormCreatePermission } from "./pages/PermissionPage/components/FormCreatePermission";
import { Property } from "./pages/PropertyPage/components/Property";
import { FormCreateUser } from "./pages/UserPage/components/FormCreateUser";
import { PropertyList } from './pages/PropertyPage/components/PropertyList';
import { LocalizationPage } from './pages/LocalizationPage';
import { LocalizationList } from './pages/LocalizationPage/components/LocalizationList';
import { CityPage } from './pages/CityPage';
import { PropertyForm } from './pages/PropertyPage/components/PropertyForm';
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"))
const Permission = lazy(() => import("./pages/UserPage/components/Permission/Permission"))
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const ActivityPage = lazy(() => import("./pages/ActivityPage/ActivityPage"));
const BeneficiaryPage = lazy(() => import("./pages/BeneficiaryPage/BeneficiaryPage"));
const PermissionPage = lazy(() => import('./pages/PermissionPage/PermissionPage'))
const PropertyPage = lazy(() => import('./pages/PropertyPage/PropertyPage'))
const RecordPage = lazy(() => import('./pages/RecordPage/RecordPage'))
const UserList = lazy(() => import('./pages/UserPage/components/UserList/UserList'));
const NavBar = lazy(() => import('./components/Navbar/Navbar'))

const LazyComponent = ({ Component }: { Component: React.ComponentType<NonNullable<unknown>> }) => {
  return <Suspense fallback={<div>Cargando modulo...</div>}>
    <Component />
  </Suspense>
}

function App() {
  return (
    <BrowserRouter >
      <AxiosProvider>
        <Routes>
          <Route path="/" element={<LazyComponent Component={NavBar} />}>
            <Route index element={<LazyComponent Component={HomePage} />} />
            <Route path="/users">
              <Route index element={<LazyComponent Component={UserList} />} />
              <Route path="create" Component={FormCreateUser} />
              <Route
                path="edit"
                Component={() => {
                  const { state } = useLocation()

                  return <FormCreateUser user={state} />
                }}
              />
              <Route path="permissions" element={<LazyComponent Component={Permission} />} />
            </Route>
            <Route path="/admin">
              {/* <Route index Component={AdminPage} /> */}
              <Route path="records" element={<LazyComponent Component={RecordPage} />} />
              <Route path="permissions">
                <Route index element={<LazyComponent Component={PermissionPage} />} />
                <Route path="create" Component={FormCreatePermission} />
                <Route path="edit" Component={() => {
                  const { state } = useLocation()

                  return <FormCreatePermission permission={state} />
                }}></Route>
              </Route>
              <Route path="properties" element={<LazyComponent Component={PropertyPage} />} >
                <Route index Component={PropertyList}></Route>
                <Route path='create' Component={PropertyForm}></Route>
                <Route path=':id' Component={Property}></Route>
              </Route>
              <Route path="activities" element={<LazyComponent Component={ActivityPage} />} />
              <Route path="beneficiaries" element={<LazyComponent Component={BeneficiaryPage} />} />
              <Route path='localizations' element={<LazyComponent Component={LocalizationPage} />}>
                <Route index Component={LocalizationList}></Route>
              </Route>
              <Route path='cities' element={<LazyComponent Component={CityPage} />}></Route>
              <Route path='provinces'></Route>
              <Route path='municipalities'></Route>
            </Route>
          </Route>
          <Route path="/auth">
            <Route index Component={LoginPage} />
          </Route>

          <Route path="*" element={<LazyComponent Component={NotFoundPage} />}></Route>
        </Routes>
      </AxiosProvider >
    </BrowserRouter >
  );
}

export default App;
