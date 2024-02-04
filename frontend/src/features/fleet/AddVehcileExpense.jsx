import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetVehicleQuery, useAddVehicleExpMutation } from './fleetApiSlice';
import { clearCredential } from '../users/authSlice';
import FormContainer from '../../components/FromContainer';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';

const AddVehicleExpense = () => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState(0);
  const [expType, setExpType] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { code } = useParams();

  const { data, isSuccess } = useGetVehicleQuery(code);

  const [addVehicleExp, { isLoading, error }] = useAddVehicleExpMutation();

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await addVehicleExp({
        code,
        amount,
        desc,
        expType,
      }).unwrap();

      navigate(`/fleet/${code}/expenses`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  return (
    <FormContainer>
      {isLoading && <Loader />}
      <h2>إضافة مصرف للمركبة {isSuccess && data.vehicle.vehCode}</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='desc'>
          <Form.Label>الوصف</Form.Label>
          <Form.Control
            type='text'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='amount'>
          <Form.Label>المبلغ</Form.Label>
          <Form.Control
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>التصنيف</Form.Label>
          <Form.Select
            onChange={(e) => setExpType(e.target.value)}
            value={expType}
          >
            <option selected>إختر التصنيف</option>
            <option value='صيانة'>صيانة</option>
            <option value='ترخيص'>ترخيص</option>
            <option value='تأمين'>تأمين</option>
            <option value='وقود'>وقود</option>
            <option value='أخرى'>أخرى</option>
          </Form.Select>
        </Form.Group>
        <Button type='submit' variant='primary' className='mt-3'>
          إضافة
        </Button>
      </Form>
    </FormContainer>
  );
};

export default AddVehicleExpense;
