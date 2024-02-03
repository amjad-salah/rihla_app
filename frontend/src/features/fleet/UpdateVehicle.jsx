import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateVehicleMutation, useGetVehicleQuery } from './fleetApiSlice';
import { clearCredential } from '../users/authSlice';
import FormContainer from '../../components/FromContainer';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';
import moment from 'moment';

const UpdateVehicle = () => {
  const { code } = useParams();

  const [updateVehicle] = useUpdateVehicleMutation();
  const { data, isLoading, isSuccess, error } = useGetVehicleQuery(code);

  const [vehMake, setVehMake] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehYear, setVehYear] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [vehType, setVehType] = useState('');
  const [status, setStatus] = useState('');
  const [capacity, setCapacity] = useState('');
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      setVehMake(data.vehicle.vehMake);
      setVehModel(data.vehicle.vehModel);
      setVehYear(data.vehicle.vehYear);
      setRegisterNumber(data.vehicle.registerNumber);
      setVehType(data.vehicle.vehType);
      setStatus(data.vehicle.status);
      setCapacity(data.vehicle.capacity);
      setNextMaintenanceDate(
        moment(data.vehicle.nextMaintenanceDate).format('YYYY-MM-DD')
      );
    }
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error, isSuccess, data]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const updatedVehic = {
      code,
      vehMake,
      vehModel,
      vehYear,
      vehType,
      status,
      registerNumber,
      nextMaintenanceDate,
      capacity,
    };

    try {
      const res = await updateVehicle(updatedVehic).unwrap();

      navigate(`/fleet/`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  let content;

  if (isLoading) {
    content = <Loader />;
  }

  // console.log(data);
  if (isSuccess) {
    content = (
      <>
        {isLoading && <Loader />}
        <h2>إضافة مركبة</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='vehMake'>
            <Form.Label>المصنع</Form.Label>
            <Form.Control
              type='text'
              value={vehMake}
              onChange={(e) => setVehMake(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className='my-2' controlId='vehMoadel'>
            <Form.Label>الطراز</Form.Label>
            <Form.Control
              type='text'
              value={vehModel}
              onChange={(e) => setVehModel(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className='my-2' controlId='vehYear'>
            <Form.Label>سنة الصنع</Form.Label>
            <Form.Control
              type='text'
              value={vehYear}
              onChange={(e) => setVehYear(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className='my-2' controlId='registerNumber'>
            <Form.Label>رقم اللوحة</Form.Label>
            <Form.Control
              type='text'
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>نوع المركبة</Form.Label>
            <Form.Select
              onChange={(e) => setVehType(e.target.value)}
              value={vehType}
            >
              <option value='باص'>باص</option>
              <option value='ميني باص'>ميني باص</option>
              <option value='شاحنة'>شاحنة</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>حالة المركبة</Form.Label>
            <Form.Select
              onChange={(e) => setStatus(e.target.value)}
              value={status}
            >
              <option value='متوفر'>متوفر</option>
              <option value='في الطريق'>في الطريق</option>
              <option value='في الصيانة'>في الصيانة</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className='my-2' controlId='capacity'>
            <Form.Label>سعة المركبة</Form.Label>
            <Form.Control
              type='text'
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className='my-2' controlId='nextMaintenanceDate'>
            <Form.Label>تاريخ الصيانة القادمة</Form.Label>
            <Form.Control
              type='date'
              value={nextMaintenanceDate}
              onChange={(e) => setNextMaintenanceDate(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary' className='mt-3'>
            تعديل
          </Button>
        </Form>
      </>
    );
  }

  return <FormContainer>{content}</FormContainer>;
};

export default UpdateVehicle;
