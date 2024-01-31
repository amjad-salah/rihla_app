import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useAddUserMutation } from './userApiSlice';
import { clearCredential } from './authSlice';
import FormContainer from '../../components/FromContainer';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';

const AddUser = () => {
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addUser, { isLoading, error }] = useAddUserMutation();

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await addUser({ fullName, userName, password }).unwrap();

      navigate(`/users/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  return (
    <FormContainer>
      {isLoading && <Loader />}
      <h2>إضافة مستخدم</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='fullName'>
          <Form.Label>اﻹسم بالكامل</Form.Label>
          <Form.Control
            type='text'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='userName'>
          <Form.Label>إسم المستخدم </Form.Label>
          <Form.Control
            type='text'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>كلمة المرور</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='mt-3'>
          إضافة
        </Button>
      </Form>
    </FormContainer>
  );
};
export default AddUser;
