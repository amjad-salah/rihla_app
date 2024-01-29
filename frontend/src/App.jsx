import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';

const App = () => {
  return (
    <>
      <Header />
      <Container className='my-5'>
        <Outlet />
      </Container>
    </>
  );
};
export default App;
