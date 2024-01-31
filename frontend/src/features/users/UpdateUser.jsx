import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateUserMutation, useGetUserQuery } from './userApiSlice';
import { clearCredential } from './authSlice';
import FormContainer from '../../components/FromContainer';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';

const UpdateUser = () => {
  const { id } = useParams();

  const [updateUser] = useUpdateUserMutation();
  const { data, isLoading, isSuccess, error } = useGetUserQuery(id);

  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      setFullName(data.user.fullName);
      setUserName(data.user.userName);
    }
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error, isSuccess, data]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const updatedUser = {
      id,
      fullName,
      userName,
      password,
    };

    try {
      const res = await updateUser(updatedUser).unwrap();

      navigate(`/users/${res._id}`);
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
        <h2>تعديل مستخدم</h2>
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
            تعديل
          </Button>
        </Form>
      </>
    );
  }

  return <FormContainer>{content}</FormContainer>;
};
export default UpdateUser;
