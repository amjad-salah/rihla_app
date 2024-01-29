import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import FormContainer from '../../components/FromContainer';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log('Submitted');
  };
  return (
    <FormContainer>
      <h1>تسجيل الدخول</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='userName'>
          <Form.Label>إسم المستخدم </Form.Label>
          <Form.Control
            type='text'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            name='userName'
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>كلمة المرور</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name='password'
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
