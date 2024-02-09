import { Navbar } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className='footer mt-auto py-3 bg-dark'>
      <div className='container text-center'>
        <span className='text-white'>
          Developed By:{' '}
          <a
            href='https://www.linkedin.com/in/amjad-salah-a956b851/'
            rel='noopener noreferrer'
            target='_blank'
          >
            Amjad
          </a>{' '}
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};
export default Footer;
