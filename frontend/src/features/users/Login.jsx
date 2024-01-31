import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';

import { useLoginMutation } from './userApiSlice';
import { setCredentail } from './authSlice';
import FormContainer from '../../components/FromContainer';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ userName, password }).unwrap();

      dispatch(setCredentail({ ...res }));

      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };
  return (
    <FormContainer>
      {isLoading && <Loader />}
      <h2>تسجيل الدخول</h2>
      <Form onSubmit={submitHandler}>
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
          دخول
        </Button>
      </Form>
    </FormContainer>
  );
};
export default Login;
