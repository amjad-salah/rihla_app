import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useAddDriverMutation } from './driversApiSlice';
import { clearCredential } from '../users/authSlice';
import FormContainer from '../../components/FromContainer';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';

const AddDriver = () => {
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [licenseExpDate, setLicenseExpDate] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addDriver, { isLoading, error }] = useAddDriverMutation();

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await addDriver({
        fullName,
        contactNumber,
        licenseNumber,
        licenseExpDate,
      }).unwrap();

      navigate(`/drivers`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  return (
    <>
      <Link to='/drivers' className='btn btn-outline-dark mb-5 d-print-none'>
        عودة
      </Link>
      <FormContainer>
        {isLoading && <Loader />}
        <h2>إضافة سائق</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='fullName'>
            <Form.Label>اﻹسم بالكامل</Form.Label>
            <Form.Control
              type='text'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className='my-2' controlId='contactNumber'>
            <Form.Label>رقم التلفون</Form.Label>
            <Form.Control
              type='text'
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className='my-2' controlId='licenseNumber'>
            <Form.Label>رقم الرخصة</Form.Label>
            <Form.Control
              type='text'
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className='my-2' controlId='licenseExpDate'>
            <Form.Label>تاريخ نهاية الرخصة</Form.Label>
            <Form.Control
              type='date'
              value={licenseExpDate}
              onChange={(e) => setLicenseExpDate(e.target.value)}
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
export default AddDriver;
