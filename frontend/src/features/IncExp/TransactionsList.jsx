import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { FaTrashAlt, FaEdit, FaFolderOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../components/Loader';

import { clearCredential } from '../users/authSlice';
import {
  useGetAllTransactionsQuery,
  useAddTransactionMutation,
  useDeleteTransactionMutation,
} from './transactionsApiSlice';
import { useGetAllCategoriesQuery } from './categoriesApiSlice';
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

const TransactionsList = () => {
  const [txType, setTxType] = useState('income');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('');

  const { data: companies, isLoading: comLoading } = useGetAllCompaniesQuery();
  const { data: txs, isLoading: txLoading } = useGetAllCategoriesQuery();

  const { data, isLoading, isSuccess, isError, error } =
    useGetAllTransactionsQuery();

  const [deleteTransaction] = useDeleteTransactionMutation();
  const [addTransaction, { isLoading: addLoading }] =
    useAddTransactionMutation();

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
      const res = await deleteTransaction(id).unwrap();

      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await addTransaction({
        category,
        txType,
        amount,
        description,
      }).unwrap();

      setCategory('');
      setAmount(0);
      setDescription('');
      setTxType('income');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  let content;

  if (isLoading || comLoading || txLoading) {
    content = <Loader />;
  }

  if (isSuccess) {
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
        <h6 className='text-center mb-4 fw-bold'>المعاملات</h6>

        {/* Add Form */}
        <Card className='p-4 mb-5 d-print-none'>
          <Card.Title>إضافة معاملة</Card.Title>
          {addLoading && <Loader />}
          <Form className='my-2' onSubmit={submitHandler}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>نوع المعاملة</Form.Label>
                  <Form.Select
                    onChange={(e) => setTxType(e.target.value)}
                    value={txType}
                  >
                    <option value='income'>إيراد</option>
                    <option value='expense'>مصروف</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>الفئة</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option selected>إختر الفئة</option>
                    {txType === 'income'
                      ? txs.incCats.map((cat) => (
                          <option value={`${cat._id}`} key={cat._id}>
                            {cat.catName}
                          </option>
                        ))
                      : txs.expCats.map((cat) => (
                          <option value={`${cat._id}`} key={cat._id}>
                            {cat.catName}
                          </option>
                        ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='my-2' controlId='city'>
                  <Form.Label>الوصف</Form.Label>
                  <Form.Control
                    type='text'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='my-2' controlId='city'>
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
                  placeholder='بحث برقم المعاملة'
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <InputGroup.Text>بحث</InputGroup.Text>
              </InputGroup>
            </Col>
            <Col></Col>
          </Row>
        </Form>

        <h5>المصروفات</h5>
        <hr className='mb-4' />
        <Table striped hover responsive className='mb-5'>
          <thead>
            <tr>
              <th>رقم المعاملة</th>
              <th>التاريخ</th>
              <th>الفئة</th>
              <th>الوصف</th>
              <th>المبلغ</th>
              <th className='d-print-none'></th>
            </tr>
          </thead>
          <tbody>
            {filter
              ? data.expenses
                  .filter((tx) => tx.txNumber.includes(filter))
                  .map((tx) => (
                    <tr key={tx._id}>
                      <td>{tx.txNumber}</td>
                      <td>{moment(tx.createdAt).format('L')}</td>
                      <td>{tx.category.catName}</td>
                      <td>{tx.description}</td>
                      <td>{tx.amount}</td>
                      <td className='d-print-none'>
                        <Link
                          to={`/transactions/${tx._id}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='btn btn-light text-primary'
                          title='تفاصيل'
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
                          onClick={() => deleteHandle(tx._id)}
                          title='مسح'
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
              : data.expenses.map((tx) => (
                  <tr key={tx._id}>
                    <td>{tx.txNumber}</td>
                    <td>{moment(tx.createdAt).format('L')}</td>
                    <td>{tx.category.catName}</td>
                    <td>{tx.description}</td>
                    <td>{tx.amount}</td>
                    <td className='d-print-none'>
                      <Link
                        to={`/transactions/${tx._id}`}
                        style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                        }}
                        className='btn btn-light text-primary'
                        title='تفاصيل'
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
                        onClick={() => deleteHandle(tx._id)}
                        title='مسح'
                      >
                        <FaTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
        <h5>الإيرادات</h5>
        <hr className='mb-4' />
        <Table striped hover responsive className='mb-5'>
          <thead>
            <tr>
              <th>رقم المعاملة</th>
              <th>التاريخ</th>
              <th>الفئة</th>
              <th>الوصف</th>
              <th>المبلغ</th>
              <th className='d-print-none'></th>
            </tr>
          </thead>
          <tbody>
            {filter
              ? data.incomes
                  .filter((tx) => tx.txNumber.includes(filter))
                  .map((tx) => (
                    <tr key={tx._id}>
                      <td>{tx.txNumber}</td>
                      <td>{moment(tx.createdAt).format('L')}</td>
                      <td>{tx.category.catName}</td>
                      <td>{tx.description}</td>
                      <td>{tx.amount}</td>
                      <td className='d-print-none'>
                        <Link
                          to={`/transactions/${tx._id}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                          }}
                          className='btn btn-light text-primary'
                          title='تفاصيل'
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
                          onClick={() => deleteHandle(tx._id)}
                          title='مسح'
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
              : data.incomes.map((tx) => (
                  <tr key={tx._id}>
                    <td>{tx.txNumber}</td>
                    <td>{moment(tx.createdAt).format('L')}</td>
                    <td>{tx.category.catName}</td>
                    <td>{tx.description}</td>
                    <td>{tx.amount}</td>
                    <td className='d-print-none'>
                      <Link
                        to={`/transactions/${tx._id}`}
                        style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                        }}
                        className='btn btn-light text-primary'
                        title='تفاصيل'
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
                        onClick={() => deleteHandle(tx._id)}
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
export default TransactionsList;
