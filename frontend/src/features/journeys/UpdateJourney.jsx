import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useUpdateJourneyMutation,
  useGetJourneyQuery,
} from './journeysApiSlice';
import { useGetAllVehiclesQuery } from '../fleet/fleetApiSlice';
import { useGetAllDriversQuery } from '../drivers/driversApiSlice';
import { useGetAllDestinationsQuery } from '../destinations/destinationsApiSlice';
import { clearCredential } from '../users/authSlice';
import FormContainer from '../../components/FromContainer';
import { Form, Button, Container } from 'react-bootstrap';
import Loader from '../../components/Loader';
import moment from 'moment';

const Updatjourney = () => {
  const { code } = useParams();

  const [journeyType, setJourneyType] = useState('');
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
  const {
    data,
    isSuccess,
    isLoading: jrLoading,
    isError,
    error: jrErr,
  } = useGetJourneyQuery(code);

  const [updatJourney, { isLoading }] = useUpdateJourneyMutation();

  let content;

  useEffect(() => {
    if (isSuccess) {
      setJourneyType(data.journey.journeyType);
      setArrivalCity(data.journey.arrivalCity._id);
      setDepartureCity(data.journey.departureCity._id);
      setDepartureTime(
        moment(data.journey.departureTime).format('YYYY-MM-DDTkk:mm:ss')
      );
      setDriver(data.journey.driver._id);
      setVehicle(data.journey.vehicle._id);
    }
    if (isError && jrErr.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [
    navigate,
    dispatch,
    isError,
    jrErr,
    destSuccess,
    driSuccess,
    vehSuccess,
    dests,
    drivers,
    vehicles,
    isSuccess,
    data,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await updatJourney({
        journeyNo: code,
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

  if (destLoading || driLoading || vehLoading || jrLoading) {
    content = <Loader />;
  } else if (destSuccess && driSuccess && vehSuccess && isSuccess) {
    content = (
      <>
        {isLoading && <Loader />}
        <FormContainer>
          <h2>تعديل رحلة</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>نوع الرحلة</Form.Label>
              <Form.Select
                onChange={(e) => setJourneyType(e.target.value)}
                value={journeyType}
              >
                <option>إختر نوع الرحلة</option>
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
                <option>إختر المدينة</option>
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
                <option>إختر المدينة</option>
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
                <option>إختر المركبة</option>
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
                <option>إختر السائق</option>
                {drivers.drivers.map((dr) => (
                  <option key={dr._id} value={`${dr._id}`}>
                    {dr.fullName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-3'>
              حفظ
            </Button>
          </Form>
        </FormContainer>
      </>
    );
  }

  return (
    <Container>
      {isError && toast.error(jrErr.message)}
      {content}
    </Container>
  );
};

export default Updatjourney;
