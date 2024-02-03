import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredential } from '../users/authSlice';

import { FaTrashAlt, FaEdit, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../components/Loader';
import { useGetAllVehiclesQuery } from './fleetApiSlice';
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
} from 'react-bootstrap';

const FleetList = () => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetAllVehiclesQuery();
  // const [deleteUser] = useGetAllVehiclesQuery();

  const [filter, setFilter] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error]);

  // const deleteHandle = async (id) => {
  //   try {
  //     const res = await deleteUser(id);

  //     toast.success(res.message);
  //   } catch (err) {
  //     toast.error(err?.error?.message);
  //   }
  // };

  let content;

  if (isLoading) {
    content = <Loader />;
  }

  if (isError) {
    toast.error(error?.message);
  }

  if (isSuccess) {
    content = (
      <>
        <h1 className='text-center mb-2'>المركبات</h1>
        <hr className='mb-5' />
        <Form className='my-5 d-print-none'>
          <Row>
            <Col>
              <InputGroup>
                <Form.Control
                  type='text'
                  placeholder='بحث برمز المركبة'
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <InputGroup.Text>بحث</InputGroup.Text>
              </InputGroup>
            </Col>
            <Col></Col>
          </Row>
        </Form>
        <Table striped hover responsive id='usersTable'>
          <thead>
            <tr>
              <th>رمز المركبة</th>
              <th>التفاصيل</th>
              <th>رقم اللوحة</th>
              <th>نوع المركبة</th>
              <th>السعة</th>
              <th>الحالة</th>
              <th>عدد الرحلات</th>
              <th>تاريخ اﻹضافة</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filter
              ? data.vehicles
                  .filter((vehicle) => {
                    return vehicle.vehCode === Number(filter);
                  })
                  .map((vehicle) => (
                    <tr key={vehicle._id}>
                      <td>{vehicle.vehCode}</td>
                      <td>{`${vehicle.vehMake} - ${vehicle.vehModel} - ${vehicle.vehYear}`}</td>
                      <td>{vehicle.registerNumber}</td>
                      <td>{vehicle.vehType}</td>
                      <td>{vehicle.capacity}</td>
                      <td>{vehicle.status}</td>
                      <td>{vehicle.journeys.length}</td>
                      <td>{moment(vehicle.createdAt).format('L')}</td>
                      <td className='text-center d-print-none'>
                        <Link
                          to={`/fleet/${vehicle.vehCode}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='btn btn-light text-primary'
                        >
                          <FaInfoCircle />
                        </Link>
                        <Link
                          to={`/fleet/edit/${vehicle._id}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='btn btn-light text-primary'
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
                          // onClick={() => deleteHandle(user._id)}
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
              : data.vehicles.map((vehicle) => (
                  <tr key={vehicle._id}>
                    <td>{vehicle.vehCode}</td>
                    <td>{`${vehicle.vehMake} - ${vehicle.vehModel} - ${vehicle.vehYear}`}</td>
                    <td>{vehicle.registerNumber}</td>
                    <td>{vehicle.vehType}</td>
                    <td>{vehicle.capacity}</td>
                    <td>{vehicle.status}</td>
                    <td>{vehicle.journeys.length}</td>
                    <td>{moment(vehicle.createdAt).format('L')}</td>
                    <td className='text-center d-print-none'>
                      <Link
                        to={`/fleet/${vehicle.vehCode}`}
                        style={{ display: 'inline-block', marginLeft: '10px' }}
                        className='btn btn-light text-primary'
                      >
                        <FaInfoCircle />
                      </Link>
                      <Link
                        to={`/fleet/edit/${vehicle._id}`}
                        style={{ display: 'inline-block', marginLeft: '10px' }}
                        className='btn btn-light text-primary'
                      >
                        <FaEdit />
                      </Link>
                      <Button
                        style={{ display: 'inline-block', marginLeft: '10px' }}
                        className='text-danger'
                        variant='light'
                        // onClick={() => deleteHandle(user._id)}
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

  return <Container className='pt-5 mt-5'>{content}</Container>;
};

export default FleetList;
