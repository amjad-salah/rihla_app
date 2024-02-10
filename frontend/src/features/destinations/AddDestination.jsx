import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useAddDestinationMutation } from './destinationsApiSlice';
import { clearCredential } from '../users/authSlice';
import FormContainer from '../../components/FromContainer';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';

const AddDestination = () => {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addDest, { isLoading, error }] = useAddDestinationMutation();

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await addDest({
        country,
        city,
      }).unwrap();

      navigate(`/destinations`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  return (
    <>
      <Link
        to='/destinations'
        className='btn btn-outline-dark mb-5 d-print-none'
      >
        عودة
      </Link>
      <FormContainer>
        {isLoading && <Loader />}
        <h2>إضافة وجهة</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='country'>
            <Form.Label>الدولة</Form.Label>
            <Form.Control
              type='text'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className='my-2' controlId='city'>
            <Form.Label>المدينة</Form.Label>
            <Form.Control
              type='text'
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary' className='mt-3'>
            إضافة
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};
export default AddDestination;
