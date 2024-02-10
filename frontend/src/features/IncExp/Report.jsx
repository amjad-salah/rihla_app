import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredential } from '../users/authSlice';

import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import moment from 'moment';

import { useGetAllCategoriesQuery } from './categoriesApiSlice';
import { useGetAllCompaniesQuery } from '../company/companyApiSlice';

import { Container, Table, Row, Col, Card } from 'react-bootstrap';

const Report = () => {
  const { data: companies, isLoading: comLoading } = useGetAllCompaniesQuery();

  const { data, isLoading, isSuccess, isError, error } =
    useGetAllCategoriesQuery();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error]);

  let content;
  let totalExp = 0;
  let totalInc = 0;

  if (isLoading || comLoading) {
    content = <Loader />;
  }

  if (isSuccess) {
    data.incCats.map((cat) => (totalInc += cat.balance));
    data.expCats.map((cat) => (totalExp += cat.balance));

    content = (
      <>
        {companies.companies.length && (
          <Row className='mb-2 text-center align-items-center'>
            <Col>
              <h5 className='fw-bold'>{companies.companies[0].name}</h5>
              <p>{`${companies.companies[0].address} - ${companies.companies[0].phoneNumber} - ${companies.companies[0].email}`}</p>
            </Col>
          </Row>
        )}
        <hr className='mb-2' />
        <h5 className='text-center mb-4 fw-bold'>تقرير الدخل</h5>
        <h6>المصروفات</h6>
        <hr className='mb-5' />
        <p>
          إجمالي المصروفات: <span className='fw-bold'>{totalExp}</span>
        </p>
        <Card className='p-4 mb-5'>
          {data.expCats.map((cat) => (
            <section key={cat._id}>
              <h6>{cat.catName}</h6>
              <Table striped hover responsive>
                <tbody>
                  {cat.transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td></td>
                      <td>{moment(tx.createdAt).format('L')}</td>
                      <td>{tx.amount}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </section>
          ))}
        </Card>

        <h6>اﻹيرادات</h6>
        <hr className='mb-5' />
        <p>
          إجمالي اﻹيرادات: <span className='fw-bold'>{totalInc}</span>
        </p>
        <Card className='p-4 mb-5'>
          {data.incCats.map((cat) => (
            <section key={cat._id}>
              <h6>{cat.catName}</h6>
              <Table striped hover responsive>
                <tbody>
                  {cat.transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td></td>
                      <td>{moment(tx.createdAt).format('L')}</td>
                      <td>{tx.amount}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </section>
          ))}
        </Card>
        <h4 className='text-end'>
          صافي الربح:{' '}
          <span className='fw-bold my-5 text-decoration-underline'>
            {totalInc - totalExp}
          </span>
        </h4>
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
export default Report;
