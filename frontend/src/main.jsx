import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import store from './app/stotre.js';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import './index.css';
import App from './App.jsx';
import PrivateRoutes from './components/PrivateRoutes.jsx';

import Home from './features/Home.jsx';
import Login from './features/users/Login.jsx';
import UsersList from './features/users/UsersList.jsx';
import AddUser from './features/users/AddUser.jsx';
import User from './features/users/User.jsx';
import UpdateUser from './features/users/UpdateUser.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />

      {/* Private Routes */}
      <Route path='' element={<PrivateRoutes />}>
        {/* Users */}
        <Route path='/users'>
          <Route index={true} path='/users' element={<UsersList />} />
          <Route path='/users/add' element={<AddUser />} />
          <Route path='/users/:id' element={<User />} />
          <Route path='/users/edit/:id' element={<UpdateUser />} />
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
