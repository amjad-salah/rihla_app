import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useGetDestinationQuery } from './destinationsApiSlice';
import { clearCredential } from '../users/authSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';

const Destination = () => {
  const { id } = useParams();

  const { data, isLoading, isSuccess, isError, error } =
    useGetDestinationQuery(id);

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
        <h3 className='text-center mb-5'>تفاصيل الوجهة</h3>
        <Card className='p-4 mb-5'>
          <Card.Body>
            <Row className='mb-5'>
              <Col>
                <span className='fw-bold'>الدولة: </span>
                {data.destination.country}
              </Col>
              <Col>
                <span className='fw-bold'>المدينة: </span>
                {`${data.destination.city}`}
              </Col>
              <Col>
                <span className='fw-bold'>عدد الرحلات: </span>
                {data.journeys.length}
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>رقم الرحلة</th>
              <th>نوع الرحلة</th>
              <th>تاريخ القيام</th>
              <th>الذهاب</th>
              <th>اﻹياب</th>
            </tr>
          </thead>
          <tbody>
            {data.journeys.map((journey) => (
              <tr key={journey._id}>
                <td>{journey.journeyNumber}</td>
                <td>{journey.journeyType}</td>
                <td>{moment(journey.departureTime).format('L')}</td>
                <td>{journey.departureCity.city}</td>
                <td>{journey.arrivalCity.city}</td>
              </tr>
            ))}
          </tbody>
        </Table>
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

export default Destination;
