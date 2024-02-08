import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useGetReservationQuery } from './journeysApiSlice';
import { clearCredential } from '../users/authSlice';
import { useGetAllCompaniesQuery } from '../company/companyApiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';

const Reservation = () => {
  const { code, id } = useParams();

  const { data: companies, isLoading: comLoading } = useGetAllCompaniesQuery();
  const { data, isLoading, isSuccess, isError, error } = useGetReservationQuery(
    { journeyNo: code, id }
  );

  let content;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error]);

  if (isLoading) {
    content = <Loader />;
  }

  if (isSuccess) {
    content = (
      <>
        {companies.companies.length && (
          <Row className='text-center align-items-center'>
            <Col>
              <h5 className='fw-bold'>{companies.companies[0].name}</h5>
              <p>{`${companies.companies[0].address} - ${companies.companies[0].phoneNumber} - ${companies.companies[0].email}`}</p>
            </Col>
          </Row>
        )}
        <hr className='mb-5' />
        <Card className='p-4'>
          <Card.Body>
            <Row>
              <Col>
                <span className='fw-bold'>إسم العميل: </span>
                {data.reservation.customerName}
              </Col>
              <Col>
                <span className='fw-bold'>رقم الرحلة: </span>
                {data.journey.journeyNumber}
              </Col>
              <Col>
                <span className='fw-bold'>رقم الجواز: </span>
                {data.reservation.passportNumber}
              </Col>
            </Row>

            <Row className='mt-4'>
              <Col>
                <span className='fw-bold'>المبلغ: </span>
                {data.reservation.amount}
              </Col>
              <Col>
                <span className='fw-bold'>رقم المقعد: </span>
                {data.reservation.seatNumber}
              </Col>
              <Col>
                <span className='fw-bold'>حالة الحجز: </span>
                {data.reservation.reservationStatus}
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col>
                <span className='fw-bold'>جهة القيام: </span>
                {data.journey.departureCity.city}
              </Col>
              <Col>
                <span className='fw-bold'>جهة الوصول: </span>
                {data.journey.arrivalCity.city}
              </Col>
              <Col>
                <span className='fw-bold'>تاريخ القيام: </span>
                {moment(data.journey.departureTime).format('llll')}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }

  return (
    <>
      {isError && toast.error(error?.data?.message)}
      <Container>{content}</Container>
    </>
  );
};

export default Reservation;
