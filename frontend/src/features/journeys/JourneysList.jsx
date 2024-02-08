import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredential } from '../users/authSlice';

import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../components/Loader';
import {
  useGetAllJourneysQuery,
  useDeleteJourneyMutation,
} from './journeysApiSlice';
import { useGetAllCompaniesQuery } from '../company/companyApiSlice';
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
} from 'react-bootstrap';

const JourneysList = () => {
  const [filter, setFilter] = useState('');

  const { data: companies, isLoading: comLoading } = useGetAllCompaniesQuery();

  const { data, isLoading, isSuccess, isError, error } =
    useGetAllJourneysQuery();
  const [deleteJourney] = useDeleteJourneyMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error]);

  const deleteHandle = async (journeyNumber) => {
    try {
      const res = await deleteJourney(journeyNumber);

      toast.success(res.message);
    } catch (err) {
      toast.error(err?.error?.message);
    }
  };

  let content;

  if (isLoading) {
    content = <Loader />;
  }

  if (isSuccess) {
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
        <h6 className='text-center fw-bold mb-2'>الرحلات</h6>
        <Form className='my-5 d-print-none'>
          <Row>
            <Col>
              <InputGroup>
                <Form.Control
                  type='text'
                  placeholder='بحث برقم الرحلة'
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <InputGroup.Text>بحث</InputGroup.Text>
              </InputGroup>
            </Col>
            <Col></Col>
          </Row>
        </Form>
        <h4 className='mb-2'>الشحن</h4>
        <Table striped hover responsive className='mb-5'>
          <thead>
            <tr>
              <th>رقم الرحلة</th>
              <th>تاريخ القيام</th>
              <th>القيام من</th>
              <th>الوصول إلى</th>
              <th>السائق</th>
              <th>المركبة</th>
              <th className='d-print-none'></th>
            </tr>
          </thead>
          <tbody>
            {filter
              ? data.cargoJourneys
                  .filter((journey) => {
                    return journey.journeyNumber.includes(filter);
                  })
                  .map((journey) => (
                    <tr key={journey.journeyNumber}>
                      <td>
                        <Link
                          to={`/journeys/${journey.journeyNumber}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          title='التفاصل'
                        >
                          {journey.journeyNumber}
                        </Link>
                      </td>
                      <td>{moment(journey.departureTime).format('llll')}</td>
                      <td>{journey.departureCity.city}</td>
                      <td>{journey.arrivalCity.city}</td>
                      <td>{journey.driver.fullName}</td>
                      <td>{journey.vehicle.vehCode}</td>
                      <td className='text-center d-print-none'>
                        <Link
                          to={`/journeys/edit/${journey.journeyNumber}`}
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
                          onClick={() => deleteHandle(journey.journeyNumber)}
                          title='مسح'
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
              : data.cargoJourneys.map((journey) => (
                  <tr key={journey.journeyNumber}>
                    <td>
                      <Link
                        to={`/journeys/${journey.journeyNumber}`}
                        style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                        }}
                        title='التفاصل'
                      >
                        {journey.journeyNumber}
                      </Link>
                    </td>
                    <td>{moment(journey.departureTime).format('llll')}</td>
                    <td>{journey.departureCity.city}</td>
                    <td>{journey.arrivalCity.city}</td>
                    <td>{journey.driver.fullName}</td>
                    <td>{journey.vehicle.vehCode}</td>
                    <td className='text-center d-print-none'>
                      <Link
                        to={`/journeys/edit/${journey.journeyNumber}`}
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
                        onClick={() => deleteHandle(journey.journeyNumber)}
                        title='مسح'
                      >
                        <FaTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>

        <h4 className='mb-2'>الركاب</h4>
        <Table striped hover responsive className='mb-5'>
          <thead>
            <tr>
              <th>رقم الرحلة</th>
              <th>تاريخ القيام</th>
              <th>القيام من</th>
              <th>الوصول إلى</th>
              <th>السائق</th>
              <th>المركبة</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filter
              ? data.passengersJourneys
                  .filter((journey) => {
                    return journey.journeyNumber.includes(filter);
                  })
                  .map((journey) => (
                    <tr key={journey.journeyNumber}>
                      <td>
                        <Link
                          to={`/journeys/${journey.journeyNumber}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          title='التفاصل'
                        >
                          {journey.journeyNumber}
                        </Link>
                      </td>
                      <td>{moment(journey.departureTime).format('llll')}</td>
                      <td>{journey.departureCity.city}</td>
                      <td>{journey.arrivalCity.city}</td>
                      <td>{journey.driver.fullName}</td>
                      <td>{journey.vehicle.vehCode}</td>
                      <td className='text-center d-print-none'>
                        <Link
                          to={`/journeys/edit/${journey.journeyNumber}`}
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
                          onClick={() => deleteHandle(journey.journeyNumber)}
                          title='مسح'
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
              : data.passengersJourneys.map((journey) => (
                  <tr key={journey.journeyNumber}>
                    <td>
                      <Link
                        to={`/journeys/${journey.journeyNumber}`}
                        style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                        }}
                        title='التفاصل'
                      >
                        {journey.journeyNumber}
                      </Link>
                    </td>
                    <td>{moment(journey.departureTime).format('llll')}</td>
                    <td>{journey.departureCity.city}</td>
                    <td>{journey.arrivalCity.city}</td>
                    <td>{journey.driver.fullName}</td>
                    <td>{journey.vehicle.vehCode}</td>
                    <td className='text-center d-print-none'>
                      <Link
                        to={`/journeys/edit/${journey.journeyNumber}`}
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
                        onClick={() => deleteHandle(journey.journeyNumber)}
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
export default JourneysList;
