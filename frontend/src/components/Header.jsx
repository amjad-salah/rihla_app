import { useDispatch, useSelector } from 'react-redux';
import { useLazyLogoutQuery } from '../features/users/userApiSlice';
import { clearCredential } from '../features/users/authSlice';

import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  const [logout] = useLazyLogoutQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      dispatch(clearCredential());

      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>رحلة</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='navbar-nav' />
          <Navbar.Collapse id='navbar-nav'>
            {user ? (
              <>
                <Nav>
                  <NavDropdown title='المستخدمين' id='user'>
                    <LinkContainer to='/users'>
                      <NavDropdown.Item>عرض الكل</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/users/add'>
                      <NavDropdown.Item>إضافة مستخدم</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                </Nav>
                <Nav className='ms-auto'>
                  <LinkContainer to='/' onClick={handleLogout}>
                    <Nav.Link>
                      خروج <FaSignOutAlt />
                    </Nav.Link>
                  </LinkContainer>
                </Nav>
              </>
            ) : (
              <Nav className='ms-auto'>
                <LinkContainer to='/login'>
                  <Nav.Link>
                    دخول <FaSignInAlt />
                  </Nav.Link>
                </LinkContainer>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;
