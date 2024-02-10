import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useGetCategoryQuery } from './categoriesApiSlice';
import { clearCredential } from '../users/authSlice';
import { useGetAllCompaniesQuery } from '../company/companyApiSlice';

import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';

const Category = () => {
  const { id } = useParams();

  const { data: companies, isLoading: comLoading } = useGetAllCompaniesQuery();
  const { data, isLoading, isSuccess, isError, error } =
    useGetCategoryQuery(id);

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
        <Link
          to='/transactions/categories'
          className='btn btn-outline-dark mb-5 d-print-none'
        >
          عودة
        </Link>
        {companies.companies.length && (
          <Row className='mb-1 text-center align-items-center'>
            <Col>
              <h5 className='fw-bold'>{companies.companies[0].name}</h5>
              <p>{`${companies.companies[0].address} - ${companies.companies[0].phoneNumber} - ${companies.companies[0].email}`}</p>
            </Col>
          </Row>
        )}
        <hr className='mb-5' />
        <h6 className='text-center mb-2 fw-bold'>
          تفاصيل الفئة: {data.category.catName}
        </h6>
        <Card className='p-4 mb-5'>
          <Card.Body>
            <Row className='mb-5'>
              <Col>
                <span className='fw-bold'>اﻹسم: </span>
                {data.category.catName}
              </Col>
              <Col>
                <span className='fw-bold'>نوع الفئة: </span>
                {data.category.catType === 'expense' ? 'مصروف' : 'إيراد'}
              </Col>
              <Col>
                <span className='fw-bold'>الرصيد: </span>
                {data.category.balance}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <h5 className='mb3'>العمليات</h5>
        <Table striped responsive hover className='mb-5'>
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الوصف</th>
              <th>المبلغ</th>
              <th>رقم العملية</th>
            </tr>
          </thead>
          <tbody>
            {data.category.transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{moment(tx.createdAt).format('L')}</td>
                <td>{tx.description}</td>
                <td>{tx.amount}</td>
                <td>{tx.txNumber}</td>
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

export default Category;
