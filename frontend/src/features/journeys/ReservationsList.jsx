import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredential } from '../users/authSlice';

import { FaTrashAlt, FaEdit, FaFolderOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../components/Loader';
import {
  useGetAllReservationsQuery,
  useAddReservationMutation,
  useDeleteReservationMutation,
} from './journeysApiSlice';
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Card,
} from 'react-bootstrap';

const ReservationsList = () => {
  const { code, id } = useParams();

  const [filter, setFilter] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState(0);
  const [reservationStatus, setReservationStatus] = useState('مبدئي');
  const [seatNumber, setSeatNumber] = useState('');

  const { data, isLoading, isSuccess, isError, error } =
    useGetAllReservationsQuery(code);

  const [deleteReserv] = useDeleteReservationMutation();
  const [addReservation, { isLoading: addLoading }] =
    useAddReservationMutation();

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
      const del = {
        journeyNo: code,
        id,
      };
      const res = await deleteReserv(del);

      toast.success(res.message);
    } catch (err) {
      toast.error(err?.error?.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await addReservation({
        journeyNo: code,
        customerName,
        seatNumber,
        amount,
        reservationStatus,
      });

      setCustomerName('');
      setReservationStatus('مبدئي');
      setSeatNumber('');
      setAmount(0);
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
        <h1 className='text-center mb-2'>حجوزات الرحلة {code}</h1>
        <hr className='mb-5' />

        {/* Add Form */}
        <Card className='p-4 mb-2 d-print-none'>
          <Card.Title>إضافة حجز</Card.Title>
          {addLoading && <Loader />}
          <Form className='my-2' onSubmit={submitHandler}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>إسم العميل</Form.Label>
                  <Form.Control
                    type='tex'
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>رقم المقعد</Form.Label>
                  <Form.Control
                    type='tex'
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>حالة الحجز</Form.Label>
                  <Form.Select
                    value={reservationStatus}
                    onChange={(e) => setReservationStatus(e.target.value)}
                  >
                    <option value='مبدئي'>مبدئي</option>
                    <option value='مؤكد'>مؤكد</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>المبلغ</Form.Label>
                  <Form.Control
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button type='submit' variant='primary' className='mt-3'>
              إضافة
            </Button>
          </Form>
        </Card>

        {/* Filter Form */}
        <Form className='my-5 d-print-none'>
          <Row>
            <Col>
              <InputGroup>
                <Form.Control
                  type='text'
                  placeholder='بحث باﻹسم أو الحالة'
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <InputGroup.Text>بحث</InputGroup.Text>
              </InputGroup>
            </Col>
            <Col></Col>
          </Row>
        </Form>
        <h4 className='mb-2'>الحجوزات</h4>
        <Table striped hover responsive className='mb-5'>
          <thead>
            <tr>
              <th>أسم العميل</th>
              <th>رقم المقعد</th>
              <th>حالة الحجز</th>
              <th>المبلغ</th>
              <th>رقم الرحلة</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filter
              ? data.reservations
                  .filter(
                    (res) =>
                      res.customerName.includes(filter) ||
                      res.reservationStatus.includes(filter)
                  )
                  .map((res) => (
                    <tr key={res._id}>
                      <td>{res.customerName}</td>
                      <td>{res.seatNumber}</td>
                      <td>{res.reservationStatus}</td>
                      <td>{res.amount}</td>
                      <td>{code}</td>
                      <td className='d-print-none'>
                        <Link
                          to={`/journeys/${code}/reservs/${res._d}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='btn btn-light text-primary'
                          title='تفاصيل'
                        >
                          <FaFolderOpen />
                        </Link>
                        <Link
                          to={`/journeys/${code}/reservs/edit/${res._d}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='btn btn-light text-primary'
                          title='تعديل'
                        >
                          <FaEdit />
                        </Link>
                        <Button
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='text-danger'
                          variant='light'
                          onClick={() => deleteHandle(res._id)}
                          title='مسح'
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
              : data.reservations.map((res) => (
                  <tr key={res._id}>
                    <td>{res.customerName}</td>
                    <td>{res.seatNumber}</td>
                    <td>{res.reservationStatus}</td>
                    <td>{res.amount}</td>
                    <td>{code}</td>
                    <td className='d-print-none'>
                      <Link
                        to={`/journeys/${code}/reservs/${res._d}`}
                        style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                        }}
                        className='btn btn-light text-primary'
                        title='تفاصيل'
                      >
                        <FaFolderOpen />
                      </Link>
                      <Link
                        to={`/journeys/${code}/reservs/edit/${res._d}`}
                        style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                        }}
                        className='btn btn-light text-primary'
                        title='تعديل'
                      >
                        <FaEdit />
                      </Link>
                      <Button
                        style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                        }}
                        className='text-danger'
                        variant='light'
                        onClick={() => deleteHandle(res._id)}
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
export default ReservationsList;
