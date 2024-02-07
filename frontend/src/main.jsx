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

import FleetList from './features/fleet/FleetList.jsx';
import Vehicle from './features/fleet/Vehicle.jsx';
import AddVehicle from './features/fleet/AddVehicle.jsx';
import UpdateVehicle from './features/fleet/UpdateVehicle.jsx';
import VehicleExpenses from './features/fleet/VehicleExpenses.jsx';
import AddVehicleExpense from './features/fleet/AddVehcileExpense.jsx';

import DriversList from './features/drivers/DriversList.jsx';
import AddDriver from './features/drivers/AddDriver.jsx';
import Driver from './features/drivers/Driver.jsx';
import UpdateDriver from './features/drivers/UpdateDriver.jsx';

import DestinationsList from './features/destinations/DestinationsList.jsx';
import AddDestination from './features/destinations/AddDestination.jsx';
import Destination from './features/destinations/Destination.jsx';

import JourneysList from './features/journeys/JourneysList.jsx';
import AddJourney from './features/journeys/AddJourney.jsx';
import Journey from './features/journeys/Journey.jsx';
import Updatjourney from './features/journeys/UpdateJourney.jsx';
import ReservationsList from './features/journeys/ReservationsList.jsx';

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

        {/* Fleet Routes */}
        <Route path='/fleet'>
          <Route index={true} path='/fleet' element={<FleetList />} />
          <Route path='/fleet/:code' element={<Vehicle />} />
          <Route path='/fleet/add' element={<AddVehicle />} />
          <Route path='/fleet/edit/:id' element={<UpdateVehicle />} />
          <Route path='/fleet/:code/expenses' element={<VehicleExpenses />} />
          <Route
            path='/fleet/:code/expenses/add'
            element={<AddVehicleExpense />}
          />
        </Route>

        {/* Drivers Route */}
        <Route path='/drivers'>
          <Route index={true} path='/drivers' element={<DriversList />} />
          <Route path='/drivers/:id' element={<Driver />} />
          <Route path='/drivers/add' element={<AddDriver />} />
          <Route path='/drivers/edit/:id' element={<UpdateDriver />} />
        </Route>

        {/* Destinations Route */}
        <Route path='/destinations'>
          <Route
            index={true}
            path='/destinations'
            element={<DestinationsList />}
          />
          <Route path='/destinations/:id' element={<Destination />} />
          <Route path='/destinations/add' element={<AddDestination />} />
        </Route>
      </Route>

      {/* Journeys Route */}
      <Route path='/journeys'>
        <Route index={true} path='/journeys' element={<JourneysList />} />
        <Route path='/journeys/:code' element={<Journey />} />
        <Route path='/journeys/add' element={<AddJourney />} />
        <Route path='/journeys/:code' element={<Journey />} />
        <Route path='/journeys/:code/reservs' element={<ReservationsList />} />
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
