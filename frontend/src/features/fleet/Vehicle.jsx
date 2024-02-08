import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useGetVehicleQuery } from './fleetApiSlice';
import { clearCredential } from '../users/authSlice';
import { useGetAllCompaniesQuery } from '../company/companyApiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';
import { FaMoneyBill } from 'react-icons/fa';

const Vehicle = () => {
  const { code } = useParams();

  const { data: companies, isLoading: comLoading } = useGetAllCompaniesQuery();
  const { data, isLoading, isSuccess, isError, error } =
    useGetVehicleQuery(code);

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
    if (data.vehicle.expenses) {
      data.vehicle.expenses.map((exp) => {
        totalExp += exp.amount;
      });
    }
    if (data.journeys) {
      data.journeys.map((journey) =>
        journey.incomes.map((inc) => {
          totalInc += inc.amount;
        })
      );
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
        <h6 className='text-center mb-5 fw-bold'>{`المركبة ${data.vehicle.vehCode}`}</h6>
        <Card className='p-4'>
          <Card.Body>
            <Row>
              <Col>
                <span className='fw-bold'>رمز المركبة: </span>
                {data.vehicle.vehCode}
              </Col>
              <Col>
                <span className='fw-bold'> التفاصيل: </span>
                {`${data.vehicle.vehMake}-${data.vehicle.vehModel}-${data.vehicle.vehYear}`}
              </Col>
              <Col>
                <span className='fw-bold'> رقم اللوحة: </span>
                {data.vehicle.registerNumber}
              </Col>
              <Col>
                <span className='fw-bold'> نوع المركبة: </span>
                {data.vehicle.vehType}
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col>
                <span className='fw-bold'>السعة: </span>
                {data.vehicle.capacity}
              </Col>
              <Col>
                <span className='fw-bold'> الحالة: </span>
                {data.vehicle.status}
              </Col>
              <Col>
                <span className='fw-bold'> عدد الرحلات: </span>
                {data.journeys.length}
              </Col>
              <Col>
                <span className='fw-bold'> تاريخ اﻹضافة: </span>
                {moment(data.vehicle.createdAt).format('L')}
              </Col>
            </Row>
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
        {/* <Card className='p-4 mt-4'>
          <Card.Body>
            <h4>
              <FaMoneyBill /> المصروفات
            </h4>
            <p>
              <span className='fw-bold'>إجمالي المصروفات: </span>
              {totalExp}
            </p>
            <hr />
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>نوع الصرف</th>
                  <th>الوصف</th>
                  <th>المبلغ</th>
                  <th>تاريخ اﻹضافة</th>
                </tr>
              </thead>
              <tbody>
                {data.vehicle.expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.expType}</td>
                    <td>{expense.desc}</td>
                    <td>{expense.amount}</td>
                    <td>{moment(expense.createdAt).format('L')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <Card className='p-4 mt-4'>
          <Card.Body>
            <h4>
              <FaMoneyBill /> الدخل
            </h4>
            <p>
              <span className='fw-bold'>إجمالي الدخل: </span>
              {totalInc}
            </p>
            <hr />
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>رقم الرحلة</th>
                  <th>الوصف</th>
                  <th>المبلغ</th>
                  <th>تاريخ اﻹضافة</th>
                </tr>
              </thead>
              <tbody>
                {data.journeys.map((journey) =>
                  journey.incomes.map((income) => (
                    <tr key={income._id}>
                      <td>{journey.journeyNumber}</td>
                      <td>{income.desc}</td>
                      <td>{income.amount}</td>
                      <td>{moment(income.createdAt).format('L')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <h4 className='mt-5'>صافي الدخل: {totalInc - totalExp}</h4> */}
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

export default Vehicle;
