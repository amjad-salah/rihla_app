import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredential } from '../users/authSlice';

import { FaTrashAlt, FaEdit, FaFolderOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import {
  useGetAllCompaniesQuery,
  useDeleteComapnyMutation,
  useAddComapnyMutation,
} from './companyApiSlice';
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  Card,
} from 'react-bootstrap';

const CompaniesList = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { data, isLoading, isSuccess, isError, error } =
    useGetAllCompaniesQuery();
  const [deleteCompany] = useDeleteComapnyMutation();
  const [addCompany, { isLoading: addLoading, isError: addErr, error: err }] =
    useAddComapnyMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error]);

  const deleteHandle = async (id) => {
    try {
      const res = await deleteCompany(id).unwrap();

      toast.success(res.message);
    } catch (err) {
      toast.error(err?.error?.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await addCompany({
        name,
        address,
        email,
        phoneNumber,
      }).unwrap();

      setAddress('');
      setEmail('');
      setName('');
      setPhoneNumber('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  let content;

  if (isLoading) {
    content = <Loader />;
  }

  if (isSuccess) {
    content = (
      <>
        <h1 className='text-center mb-2'>معلومات الشركة</h1>
        <hr className='mb-5' />
        {addErr && toast.error(err.data.message)}
        <Card className='p-4 mb-2 d-print-none'>
          <Card.Title>إضافة شركة</Card.Title>
          {addLoading && <Loader />}
          <Form className='my-2' onSubmit={submitHandler}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>إسم الشركة</Form.Label>
                  <Form.Control
                    type='tex'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>رقم التلفون</Form.Label>
                  <Form.Control
                    type='tex'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>البريد اﻹلكتروني</Form.Label>
                  <Form.Control
                    type='tex'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>العنوان</Form.Label>
                  <Form.Control
                    type='tex'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button type='submit' variant='primary' className='mt-3'>
              إضافة
            </Button>
          </Form>
        </Card>

        <Table striped hover responsive>
          <thead>
            <tr>
              <th>اﻹسم</th>
              <th>رقم التلفون</th>
              <th>البريد اﻹلكتروني</th>
              <th>العنوان</th>
              <th className='d-print-none'></th>
            </tr>
          </thead>
          <tbody>
            {data.companies.map((company) => (
              <tr key={company._id}>
                <td>{company.name}</td>
                <td>{company.phoneNumber}</td>
                <td>{company.email}</td>
                <td>{company.address}</td>
                <td className='text-center d-print-none'>
                  <Button
                    style={{ display: 'inline-block', marginLeft: '10px' }}
                    className='text-danger'
                    variant='light'
                    onClick={() => deleteHandle(company._id)}
                    title='مسح'
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }

  return (
    <Container>
      {isError && toast.error(error?.message)}
      {content}
    </Container>
  );
};
export default CompaniesList;
