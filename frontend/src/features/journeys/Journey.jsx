import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useGetJourneyQuery } from './journeysApiSlice';
import { clearCredential } from '../users/authSlice';
import { useGetAllCompaniesQuery } from '../company/companyApiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';

const Journey = () => {
  const { code } = useParams();

  const { data: companies, isLoading: comLoading } = useGetAllCompaniesQuery();
  const { data, isLoading, isSuccess, isError, error } =
    useGetJourneyQuery(code);

  let content;
  let totalExp = 0;
  let totalInc = 0;

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
    if (data.journey.expenses) {
      data.journey.expenses.map((exp) => {
        totalExp += exp.amount;
      });
    }
    if (data.journey.incomes) {
      data.journey.incomes.map((inc) => {
        totalInc += inc.amount;
      });
    }
    content = (
      <>
        {companies.companies.length && (
          <Row className='mb-1 text-center align-items-center'>
            <Col>
              <h5 className='fw-bold'>{companies.companies[0].name}</h5>
              <p>{`${companies.companies[0].address} - ${companies.companies[0].phoneNumber} - ${companies.companies[0].email}`}</p>
            </Col>
          </Row>
        )}
        <hr className='mb-5' />
        <h6 className='text-center mb-5 fw-bold'>{`الرحلة ${data.journey.journeyNumber}`}</h6>
        <Card className='mb-4 p-4 d-print-none'>
          <Row>
            <Col>
              <Link
                to={`/journeys/${data.journey.journeyNumber}/reservs`}
                className='btn btn-outline-primary'
              >
                الحجوزات
              </Link>
            </Col>
            <Col>
              <Link
                to={`/journeys/${data.journey.journeyNumber}/expenses`}
                className='btn btn-outline-primary'
              >
                المصروفات
              </Link>
            </Col>
            <Col>
              <Link
                to={`/journeys/${data.journey.journeyNumber}/incomes`}
                className='btn btn-outline-primary'
              >
                الدخل
              </Link>
            </Col>
          </Row>
        </Card>
        <Card className='p-4'>
          <Card.Body>
            <Row>
              <Col>
                <span className='fw-bold'>رقم الرحلة: </span>
                {data.journey.journeyNumber}
              </Col>
              <Col>
                <span className='fw-bold'>نوع الرحلة: </span>
                {data.journey.journeyType}
              </Col>
              <Col>
                <span className='fw-bold'>تاريخ القيام: </span>
                {moment(data.journey.departureTime).format('llll')}
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
                <span className='fw-bold'>المركبة: </span>
                {data.journey.vehicle.vehCode}
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col>
                <span className='fw-bold'>السائق: </span>
                {data.journey.driver.fullName}
              </Col>
            </Row>
            <hr />
            <Row className='mt-4'>
              <Col>
                <span className='fw-bold'>إجمالي المصروفات: </span>
                {totalExp}
              </Col>
              <Col>
                <span className='fw-bold'>إجمالي الدخل: </span>
                {totalInc}
              </Col>
              <Col>
                <span className='fw-bold'>صافي الدخل: </span>
                {totalInc - totalExp}
              </Col>
              <Col></Col>
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

export default Journey;
