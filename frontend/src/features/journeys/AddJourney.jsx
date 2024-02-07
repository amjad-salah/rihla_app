import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useAddJourneyMutation } from './journeysApiSlice';
import { useGetAllVehiclesQuery } from '../fleet/fleetApiSlice';
import { useGetAllDriversQuery } from '../drivers/driversApiSlice';
import { useGetAllDestinationsQuery } from '../destinations/destinationsApiSlice';
import { clearCredential } from '../users/authSlice';
import FormContainer from '../../components/FromContainer';
import { Form, Button, Container } from 'react-bootstrap';
import Loader from '../../components/Loader';

const AddJourney = () => {
  const [journeyType, setJourneyType] = useState('ركاب');
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [driver, setDriver] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: dests,
    isLoading: destLoading,
    isSuccess: destSuccess,
  } = useGetAllDestinationsQuery();
  const {
    data: drivers,
    isLoading: driLoading,
    isSuccess: driSuccess,
  } = useGetAllDriversQuery();
  const {
    data: vehicles,
    isLoading: vehLoading,
    isSuccess: vehSuccess,
  } = useGetAllVehiclesQuery();

  const [addJourney, { isLoading, error }] = useAddJourneyMutation();

  let content;

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [
    navigate,
    dispatch,
    error,
    destSuccess,
    driSuccess,
    vehSuccess,
    dests,
    drivers,
    vehicles,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await addJourney({
        journeyType,
        departureCity,
        arrivalCity,
        departureTime,
        vehicle,
        driver,
      }).unwrap();

      navigate(`/journeys/`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  if (destLoading || driLoading || vehLoading) {
    content = <Loader />;
  } else if (destSuccess && driSuccess && vehSuccess) {
    content = (
      <>
        {isLoading && <Loader />}
        <FormContainer>
          <h2>إضافة رحلة</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>نوع الرحلة</Form.Label>
              <Form.Select
                onChange={(e) => setJourneyType(e.target.value)}
                value={journeyType}
              >
                <option selected>إختر نوع الرحلة</option>
                <option value='شحن'>شحن</option>
                <option value='ركاب'>ركاب</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className='my-2' controlId='nextMaintenanceDate'>
              <Form.Label>تاريخ القيام</Form.Label>
              <Form.Control
                type='datetime-local'
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>القيام من</Form.Label>
              <Form.Select
                onChange={(e) => setDepartureCity(e.target.value)}
                value={departureCity}
              >
                <option selected>إختر المدينة</option>
                {dests.destinations.map((dest) => (
                  <option key={dest._id} value={`${dest._id}`}>
                    {dest.city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>الوصول إلى</Form.Label>
              <Form.Select
                onChange={(e) => setArrivalCity(e.target.value)}
                value={arrivalCity}
              >
                <option selected>إختر المدينة</option>
                {dests.destinations.map((dest) => (
                  <option key={dest._id} value={`${dest._id}`}>
                    {dest.city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>المركبة</Form.Label>
              <Form.Select
                onChange={(e) => setVehicle(e.target.value)}
                value={vehicle}
              >
                <option selected>إختر المركبة</option>
                {journeyType === 'ركاب'
                  ? vehicles.vehicles
                      .filter((veh) => veh.vehType !== 'شاحنة')
                      .map((veh) => (
                        <option key={veh._id} value={`${veh._id}`}>
                          {`${veh.vehMake} - ${veh.vehModel} - ${veh.vehYear}`}
                        </option>
                      ))
                  : vehicles.vehicles
                      .filter((veh) => veh.vehType === 'شاحنة')
                      .map((veh) => (
                        <option key={veh._id} value={`${veh._id}`}>
                          {`${veh.vehMake} - ${veh.vehModel} - ${veh.vehYear}`}
                        </option>
                      ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>السائق</Form.Label>
              <Form.Select
                onChange={(e) => setDriver(e.target.value)}
                value={driver}
              >
                <option selected>إختر السائق</option>
                {drivers.drivers.map((dr) => (
                  <option key={dr._id} value={`${dr._id}`}>
                    {dr.fullName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-3'>
              إضافة
            </Button>
          </Form>
        </FormContainer>
      </>
    );
  }

  return <Container>{content}</Container>;
};

export default AddJourney;
