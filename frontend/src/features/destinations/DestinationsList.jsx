import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredential } from '../users/authSlice';

import { FaTrashAlt, FaEdit, FaFolderOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../components/Loader';
import {
  useGetAllDestinationsQuery,
  useDeleteDestinationMutation,
} from './destinationsApiSlice';
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
} from 'react-bootstrap';

const DestinationsList = () => {
  const [filter, setFilter] = useState('');

  const { data, isLoading, isSuccess, isError, error } =
    useGetAllDestinationsQuery();
  const [deleteDest] = useDeleteDestinationMutation();

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
      const res = await deleteDest(id);

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
        <h1 className='text-center mb-2'>الوجهات</h1>
        <hr className='mb-5' />
        <Form className='my-5 d-print-none'>
          <Row>
            <Col>
              <InputGroup>
                <Form.Control
                  type='text'
                  placeholder='بحث بالمدينة'
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <InputGroup.Text>بحث</InputGroup.Text>
              </InputGroup>
            </Col>
            <Col></Col>
          </Row>
        </Form>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>الدولة</th>
              <th>المدينة</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filter
              ? data.destinations
                  .filter((destination) => {
                    return destination.city.includes(filter);
                  })
                  .map((destination) => (
                    <tr key={destination._id}>
                      <td>{destination.country}</td>
                      <td>{destination.city}</td>
                      <td className='text-center d-print-none'>
                        <Link
                          to={`/destinations/${destination._id}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='btn btn-light text-primary'
                          title='التفاصل'
                        >
                          <FaFolderOpen />
                        </Link>
                        <Button
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='text-danger'
                          variant='light'
                          onClick={() => deleteHandle(destination._id)}
                          title='مسح'
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
              : data.destinations.map((destination) => (
                  <tr key={destination._id}>
                    <td>{destination.country}</td>
                    <td>{destination.city}</td>
                    <td className='text-center d-print-none'>
                      <Link
                        to={`/destinations/${destination._id}`}
                        style={{ display: 'inline-block', marginLeft: '10px' }}
                        className='btn btn-light text-primary'
                        title='التفاصل'
                      >
                        <FaFolderOpen />
                      </Link>
                      <Button
                        style={{ display: 'inline-block', marginLeft: '10px' }}
                        className='text-danger'
                        variant='light'
                        onClick={() => deleteHandle(destination._id)}
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
export default DestinationsList;
