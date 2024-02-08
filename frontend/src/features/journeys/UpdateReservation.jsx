import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetReservationQuery,
  useUpdateReservationMutation,
} from './journeysApiSlice';
import { clearCredential } from '../users/authSlice';
import FormContainer from '../../components/FromContainer';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Loader from '../../components/Loader';

const UpdatResevation = () => {
  const { code, id } = useParams();

  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [reservationStatus, setReservationStatus] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [seatNumber, setSeatNumber] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isSuccess, isLoading, isError, error } = useGetReservationQuery(
    { journeyNo: code, id }
  );

  const [updatReserv, { isLoading: updLoading }] =
    useUpdateReservationMutation();

  let content;

  useEffect(() => {
    if (isSuccess) {
      setAmount(data.reservation.amount);
      setCustomerName(data.reservation.customerName);
      setPassportNumber(data.reservation.passportNumber);
      setReservationStatus(data.reservation.reservationStatus);
      setSeatNumber(data.reservation.seatNumber);
    }
    if (isError && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, data, isSuccess, error, isError]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await updatReserv({
        journeyNo: code,
        id,
        customerName,
        passportNumber,
        seatNumber,
        amount,
        reservationStatus,
      }).unwrap();

      navigate(`/journeys/${code}/reservs/${id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  if (isLoading) {
    content = <Loader />;
  } else if (isSuccess) {
    content = (
      <>
        {isLoading && <Loader />}
        <FormContainer>
          <h2>تعديل حجز</h2>
          <Form className='my-2' onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>إسم العميل</Form.Label>
              <Form.Control
                type='tex'
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>رقم الجواز</Form.Label>
              <Form.Control
                type='tex'
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>رقم المقعد</Form.Label>
              <Form.Control
                type='tex'
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>حالة الحجز</Form.Label>
              <Form.Select
                value={reservationStatus}
                onChange={(e) => setReservationStatus(e.target.value)}
              >
                <option value='مبدئي'>مبدئي</option>
                <option value='مؤكد'>مؤكد</option>
                <option value='ملغي'>ملغي</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>المبلغ</Form.Label>
              <Form.Control
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-3'>
              حفظ
            </Button>
          </Form>
        </FormContainer>
      </>
    );
  }

  return (
    <Container>
      {isError && toast.error(error.message)}
      {content}
    </Container>
  );
};

export default UpdatResevation;
