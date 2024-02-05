import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateDriverMutation, useGetDriverQuery } from './driversApiSlice';
import { clearCredential } from '../users/authSlice';
import FormContainer from '../../components/FromContainer';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';
import moment from 'moment';

const UpdateDriver = () => {
  const { id } = useParams();

  const [updateDriver] = useUpdateDriverMutation();
  const { data, isLoading, isSuccess, error } = useGetDriverQuery(id);

  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [licenseExpDate, setLicenseExpDate] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      setFullName(data.driver.fullName);
      setContactNumber(data.driver.contactNumber);
      setLicenseNumber(data.driver.licenseNumber);
      setLicenseExpDate(
        moment(data.driver.licenseExpDate).format('YYYY-MM-DD')
      );
    }

    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error, isSuccess, data]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await updateDriver({
        id,
        fullName,
        licenseExpDate,
        licenseNumber,
        contactNumber,
      }).unwrap();

      navigate(`/drivers/`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  let content;

  if (isLoading) {
    content = <Loader />;
  }

  if (isSuccess) {
    content = (
      <>
        <h2>تعديل سائق</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='fullNmae'>
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
            تعديل
          </Button>
        </Form>
      </>
    );
  }

  return <FormContainer>{content}</FormContainer>;
};

export default UpdateDriver;
