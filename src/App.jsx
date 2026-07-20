import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext, AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { BlogList } from './pages/BlogList';
import { AddBlog } from './pages/AddBlog';
import { EditBlog } from './pages/EditBlog';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './pages/NotFound';

const PrivateRouter = ({children}) => {
  const {user} = useContext(AuthContext);
  return user ? children : <Navigate to={'/login'}/>
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/',
    element:<BlogList/> 
  },
  {
    path: '/add',
    element: <PrivateRouter> <AddBlog/> </ PrivateRouter>
  },
  {
    path: '/edit/:id',
    element: <PrivateRouter> <EditBlog/> </ PrivateRouter>
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default function App(){
  return(
    <div className="container">
      <AuthProvider>
        <RouterProvider router={router}/>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </ AuthProvider>
    </div>
  )
}

