import { Container, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredential } from '../features/users/authSlice';
import { useGetUserQuery } from '../features/users/userApiSlice';
import { useEffect } from 'react';

const Hero = () => {
  const { user } = useSelector((state) => state.auth);

  const { data, isError, error } = useGetUserQuery(user?._id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError && error.status === 401) {
      dispatch(clearCredential());
    }
  }, [isError, error, dispatch]);

  return (
    <div className='py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h1 className='text-center mb-4'>مرحباً بك في برنامج رحلة</h1>
          <p className='text-center mb-4'>للبدء أختار من القائمة أعلاه</p>
        </Card>
      </Container>
    </div>
  );
};
export default Hero;
