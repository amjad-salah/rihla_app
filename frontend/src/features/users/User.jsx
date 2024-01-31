import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useGetUserQuery } from './userApiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Card, Container } from 'react-bootstrap';

const User = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useGetUserQuery(id);

  let content;

  if (isLoading) {
    content = <Loader />;
  }

  if (isError) {
    toast.error(error.message);
  }

  if (data) {
    content = (
      <Card>
        <Card.Body>
          <p>
            <span className='fw-bold'>اﻹسم: </span>
            {data.user.fullName}
          </p>
          <p>
            <span className='fw-bold'>إسم المستخدم: </span>
            {data.user.userName}
          </p>
          <p>
            <span className='fw-bold'>تاريخ اﻹضافة: </span>
            {moment(data.user.createdAt).format('L')}
          </p>
        </Card.Body>
      </Card>
    );
  }

  return <Container className='pt-5 mt-5'>{content}</Container>;
};

export default User;
