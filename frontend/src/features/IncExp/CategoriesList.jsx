import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredential } from '../users/authSlice';

import { FaTrashAlt, FaEdit, FaFolderOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} from './categoriesApiSlice';
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

const CategoriesList = () => {
  const [catType, setCatType] = useState('income');
  const [catName, setCatName] = useState('');

  const { data: companies, isLoading: comLoading } = useGetAllCompaniesQuery();

  const { data, isLoading, isSuccess, isError, error } =
    useGetAllCategoriesQuery();

  const [deleteCategory] = useDeleteCategoryMutation();
  const [addCategory, { isLoading: addLoading }] = useAddCategoryMutation();

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
      const res = await deleteCategory(id).unwrap();

      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await addCategory({
        catName,
        catType,
      }).unwrap();

      setCatName('');
      setCatName('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
          <Row className='mb-2 text-center align-items-center'>
            <Col>
              <h5 className='fw-bold'>{companies.companies[0].name}</h5>
              <p>{`${companies.companies[0].address} - ${companies.companies[0].phoneNumber} - ${companies.companies[0].email}`}</p>
            </Col>
          </Row>
        )}
        <hr className='mb-2' />
        <h6 className='text-center mb-4 fw-bold'>الفئات</h6>

        {/* Add Form */}
        <Card className='p-4 mb-5 d-print-none'>
          <Card.Title>إضافة فئة</Card.Title>
          {addLoading && <Loader />}
          <Form className='my-2' onSubmit={submitHandler}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>إسم الفئة</Form.Label>
                  <Form.Control
                    type='tex'
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>نوع الفئة</Form.Label>
                  <Form.Select
                    value={catType}
                    onChange={(e) => setCatType(e.target.value)}
                  >
                    <option value='income'>أيراد</option>
                    <option value='expense'>مصروف</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Button type='submit' variant='primary' className='mt-3'>
              إضافة
            </Button>
          </Form>
        </Card>
        <h5>فئة المصروفات</h5>
        <hr className='mb-4' />
        <Table striped hover responsive className='mb-5'>
          <thead>
            <tr>
              <th>أسم الفئة</th>
              <th>نوع الفئة</th>
              <th>الرصيد</th>
              <th className='d-print-none'></th>
            </tr>
          </thead>
          <tbody>
            {data.expCats.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.catName}</td>
                <td>مصروف</td>
                <td>{cat.balance}</td>
                <td className='d-print-none'>
                  <Link
                    to={`/transactions/categories/${cat._id}`}
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
                    onClick={() => deleteHandle(cat._id)}
                    title='مسح'
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h5>فئة الإيرادات</h5>
        <hr className='mb-4' />
        <Table striped hover responsive className='mb-5'>
          <thead>
            <tr>
              <th>أسم الفئة</th>
              <th>نوع الفئة</th>
              <th>الرصيد</th>
              <th className='d-print-none'></th>
            </tr>
          </thead>
          <tbody>
            {data.incCats.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.catName}</td>
                <td>إيراد</td>
                <td>{cat.balance}</td>
                <td className='d-print-none'>
                  <Link
                    to={`/transactions/categories/${cat._id}`}
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
                    onClick={() => deleteHandle(cat._id)}
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
export default CategoriesList;
