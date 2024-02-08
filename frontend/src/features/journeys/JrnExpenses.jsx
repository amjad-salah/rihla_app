import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredential } from '../users/authSlice';

import { FaTrashAlt, FaEdit, FaFolderOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../components/Loader';
import {
  useGetAllExpensesQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
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
  Card,
} from 'react-bootstrap';

const JrnExpenses = () => {
  const { code, id } = useParams();

  const [filter, setFilter] = useState('');
  const [expType, setExpType] = useState('وقود');
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState('');

  const { data: companies, isLoading: comLoading } = useGetAllCompaniesQuery();
  const { data, isLoading, isSuccess, isError, error } =
    useGetAllExpensesQuery(code);

  const [deleteExp] = useDeleteExpenseMutation();
  const [addExp, { isLoading: addLoading }] = useAddExpenseMutation();

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
      const del = {
        journeyNo: code,
        id,
      };
      const res = await deleteExp(del);

      toast.success(res.message);
    } catch (err) {
      toast.error(err?.error?.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await addExp({
        journeyNo: code,
        desc,
        amount,
        expType,
      });

      setAmount(0);
      setDesc('');
      setExpType('وقود');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  let content;

  if (isLoading || comLoading) {
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
        <h6 className='text-center mb-4 fw-bold'>مصروفات الرحلة {code}</h6>

        {/* Add Form */}
        <Card className='p-4 mb-2 d-print-none'>
          <Card.Title>إضافة مصروف</Card.Title>
          {addLoading && <Loader />}
          <Form className='my-2' onSubmit={submitHandler}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>الوصف</Form.Label>
                  <Form.Control
                    type='tex'
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>نوع المصروف</Form.Label>
                  <Form.Select
                    value={expType}
                    onChange={(e) => setExpType(e.target.value)}
                  >
                    <option value='وقود'>وقود</option>
                    <option value='صيانة'>صيانة</option>
                    <option value='طريق'>طريق</option>
                    <option value='أخرى'>أخرى</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>المبلغ</Form.Label>
                  <Form.Control
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button type='submit' variant='primary' className='mt-3'>
              إضافة
            </Button>
          </Form>
        </Card>

        {/* Filter Form */}
        <Form className='my-5 d-print-none'>
          <Row>
            <Col>
              <InputGroup>
                <Form.Control
                  type='text'
                  placeholder='بحث بنوع المصروف'
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <InputGroup.Text>بحث</InputGroup.Text>
              </InputGroup>
            </Col>
            <Col></Col>
          </Row>
        </Form>
        <Table striped hover responsive className='mb-5'>
          <thead>
            <tr>
              <th>رقم الرحلة</th>
              <th>الوصف</th>
              <th>نوع المصروف</th>
              <th>المبلغ</th>
              <th className='d-print-none'></th>
            </tr>
          </thead>
          <tbody>
            {filter
              ? data.expenses
                  .filter((exp) => exp.expType.includes(filter))
                  .map((exp) => (
                    <tr key={exp._id}>
                      <td>{code}</td>
                      <td>{exp.desc}</td>
                      <td>{exp.expType}</td>
                      <td>{exp.amount}</td>
                      <td className='d-print-none'>
                        <Button
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='text-danger'
                          variant='light'
                          onClick={() => deleteHandle(exp._id)}
                          title='مسح'
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
              : data.expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>{code}</td>
                    <td>{exp.desc}</td>
                    <td>{exp.expType}</td>
                    <td>{exp.amount}</td>
                    <td className='d-print-none'>
                      <Button
                        style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                        }}
                        className='text-danger'
                        variant='light'
                        onClick={() => deleteHandle(exp._id)}
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
export default JrnExpenses;
