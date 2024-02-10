import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredential } from '../users/authSlice';
import { useGetAllCompaniesQuery } from '../company/companyApiSlice';

import { FaTrashAlt, FaEdit, FaFolderOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../components/Loader';
import {
  useGetAllDriversQuery,
  useDeleteDriverMutation,
} from './driversApiSlice';
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
} from 'react-bootstrap';

const DriversList = () => {
  const [filter, setFilter] = useState('');

  const { data: companies, isLoading: comLoading } = useGetAllCompaniesQuery();
  const { data, isLoading, isSuccess, isError, error } =
    useGetAllDriversQuery();
  const [deleteDriver] = useDeleteDriverMutation();

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
      const res = await deleteDriver(id).unwrap();

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
        <h6 className='text-center mb-2 fw-bold'>السائقين</h6>
        <Form className='my-5 d-print-none'>
          <Row>
            <Col>
              <InputGroup>
                <Form.Control
                  type='text'
                  placeholder='بحث بإسم السائق'
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
              <th>اﻹسم</th>
              <th>رقم التلفون</th>
              <th>رقم الرخصة</th>
              <th>تاريخ نهاية الرخصة</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filter
              ? data.drivers
                  .filter((driver) => {
                    return driver.fullName.includes(filter);
                  })
                  .map((driver) => (
                    <tr key={driver._id}>
                      <td>{driver.fullName}</td>
                      <td>{driver.contactNumber}</td>
                      <td>{driver.licenseNumber}</td>
                      <td>{moment(driver.licenseExpDate).format('L')}</td>
                      <td className='text-center d-print-none'>
                        <Link
                          to={`/drivers/${driver._id}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='btn btn-light text-primary'
                          title='التفاصل'
                        >
                          <FaFolderOpen />
                        </Link>
                        <Link
                          to={`/drivers/edit/${driver._id}`}
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
                          onClick={() => deleteHandle(driver._id)}
                          title='مسح'
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
              : data.drivers.map((driver) => (
                  <tr key={driver._id}>
                    <td>{driver.fullName}</td>
                    <td>{driver.contactNumber}</td>
                    <td>{driver.licenseNumber}</td>
                    <td>{moment(driver.licenseExpDate).format('L')}</td>
                    <td className='text-center d-print-none'>
                      <Link
                        to={`/drivers/${driver._id}`}
                        style={{ display: 'inline-block', marginLeft: '10px' }}
                        className='btn btn-light text-primary'
                        title='التفاصل'
                      >
                        <FaFolderOpen />
                      </Link>
                      <Link
                        to={`/drivers/edit/${driver._id}`}
                        style={{ display: 'inline-block', marginLeft: '10px' }}
                        className='btn btn-light text-primary'
                        title='تعديل'
                      >
                        <FaEdit />
                      </Link>
                      <Button
                        style={{ display: 'inline-block', marginLeft: '10px' }}
                        className='text-danger'
                        variant='light'
                        onClick={() => deleteHandle(driver._id)}
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
export default DriversList;
