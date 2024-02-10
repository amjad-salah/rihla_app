import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
  useGetVehicleExpsQuery,
  useDeleteVehicleExpMutation,
} from './fleetApiSlice';
import { clearCredential } from '../users/authSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Card, Container, Row, Col, Table, Button } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';

const VehicleExpenses = () => {
  const { code } = useParams();

  const { data, isLoading, isSuccess, isError, error } =
    useGetVehicleExpsQuery(code);

  const [deleteVehicleExp, { isLoading: loading, isError: isErr, error: err }] =
    useDeleteVehicleExpMutation();

  let content;
  let totalExp = 0;

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
      const res = await deleteVehicleExp({ code, id }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  if (isSuccess) {
    data.expenses.map((exp) => {
      totalExp += exp.amount;
    });

    content = (
      <>
        <Link to='/fleet' className='btn btn-outline-dark mb-5 d-print-none'>
          عودة
        </Link>
        {(isLoading || loading) && <Loader />}
        {isErr && toast.error(err.data.message)}
        <h3 className='text-center mb-5'>{`مصروفات المركبة ${data.vehicle.vehCode}`}</h3>
        <Row>
          <Col>
            <span className='fw-bold'>تفاصيل المركبة: </span>
            {`${data.vehicle.vehMake} - ${data.vehicle.vehModel} - ${data.vehicle.registerNumber}`}
          </Col>
        </Row>
        <Card className='p-4 mt-4'>
          <Card.Body>
            <Row className='mb-3'>
              <Col>
                <p>
                  <span className='fw-bold'>إجمالي المصروفات: </span>
                  {totalExp}
                </p>
              </Col>
              <Col>
                <Link
                  to={`/fleet/${data.vehicle.vehCode}/expenses/add`}
                  className='btn btn-primary d-print-none'
                >
                  إضافة مصروف
                </Link>
              </Col>
            </Row>
            <hr />
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>نوع الصرف</th>
                  <th>الوصف</th>
                  <th>المبلغ</th>
                  <th>تاريخ اﻹضافة</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.expType}</td>
                    <td>{expense.desc}</td>
                    <td>{expense.amount}</td>
                    <td>{moment(expense.createdAt).format('L')}</td>
                    <td className='d-print-none'>
                      <Button
                        style={{ display: 'inline-block', marginLeft: '10px' }}
                        className='text-danger'
                        variant='light'
                        onClick={() => deleteHandle(expense._id)}
                        title='مسح'
                      >
                        <FaTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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

export default VehicleExpenses;
