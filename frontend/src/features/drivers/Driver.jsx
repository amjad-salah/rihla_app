import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useGetDriverQuery } from './driversApiSlice';
import { clearCredential } from '../users/authSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';

const Driver = () => {
  const { id } = useParams();

  const { data, isLoading, isSuccess, isError, error } = useGetDriverQuery(id);

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
        <h3 className='text-center mb-5'>تفاصيل السائق</h3>
        <Card className='p-4'>
          <Card.Body>
            <Row className='mb-5'>
              <Col>
                <span className='fw-bold'>اﻹسم بالكامل: </span>
                {data.driver.fullName}
              </Col>
              <Col>
                <span className='fw-bold'>رقم التلفون: </span>
                {`${data.driver.contactNumber}`}
              </Col>
              <Col>
                <span className='fw-bold'>رقم الرخصة: </span>
                {data.driver.licenseNumber}
              </Col>
            </Row>
            <Row>
              <Col>
                <span className='fw-bold'>تاريخ نهاية الرخصة: </span>
                {moment(data.driver.licenseExpDate).format('L')}
              </Col>
              <Col>
                <span className='fw-bold'> عدد الرحلات: </span>
                {data.driver.journeys.length}
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

export default Driver;
