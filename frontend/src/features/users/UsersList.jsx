import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredential } from './authSlice';

import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../components/Loader';
import { useGetAllUsersQuery } from './userApiSlice';
import { Container, Table } from 'react-bootstrap';

const UsersList = () => {
  const { data, isLoading, isError, error } = useGetAllUsersQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(clearCredential());

      navigate('/login');
    }
  }, [navigate, dispatch, error]);

  let content;

  if (isLoading) {
    content = <Loader />;
  }

  if (isError) {
    content = toast.error(error?.message);
  }

  if (data) {
    content = (
      <>
        <h1 className='text-center mb-2'>المستخدمين</h1>
        <hr className='mb-5' />
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>اﻹسم</th>
              <th>إسم المستخدم</th>
              <th>تاريخ اﻹضافة</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.userName}</td>
                <td>{moment(user.createdAt).format('L')}</td>
                <td className='text-center'>
                  <Link
                    to={`/users/${user._id}`}
                    style={{ display: 'inline-block', marginLeft: '10px' }}
                  >
                    <FaInfoCircle size={28} />
                  </Link>
                  <Link
                    to={`/users/edit/${user._id}`}
                    style={{ display: 'inline-block', marginLeft: '10px' }}
                  >
                    <FaEdit size={28} />
                  </Link>
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
export default UsersList;
