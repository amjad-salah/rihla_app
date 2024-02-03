import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useGetVehicleExpsQuery } from './fleetApiSlice';
import { clearCredential } from '../users/authSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Card, Container, Row, Col, Table, Button } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';

const VehicleExpenses = () => {
  const { code } = useParams();

  const { data, isLoading, isSuccess, isError, error } =
    useGetVehicleExpsQuery(code);

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

  if (isLoading) {
    content = <Loader />;
  }

  if (isSuccess) {
    data.expenses.map((exp) => {
      totalExp += exp.amount;
    });

    content = (
      <>
        <h3 className='text-center mb-5'>{`مصروفات المركبة ${data.vehicle.vehCode}`}</h3>
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
                        // onClick={() => deleteHandle(vehicle.vehCode)}
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
