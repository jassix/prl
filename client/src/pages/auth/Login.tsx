import React, { useState } from 'react';
import {
  Center,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  useToast,
  Divider
} from '@chakra-ui/react';
import config from '../../assets/json/config.json';
import stl from './Auth.module.scss';
import { FaKey, FaPaperclip } from 'react-icons/fa';
import axios, { AxiosResponse } from 'axios';

const Login = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const authHandler = () => {
    axios
      .post('http://localhost:5000/auth/login', {
        username: token,
        password: password
      })
      .then((response: AxiosResponse<any>) => {
        toast({
          title: 'Auth Info',
          description: `You are logged in ${token}`,
          variant: 'top-accent',
          status: 'success',
          position: 'top'
        });

        localStorage.setItem('nickname', token);
        localStorage.setItem('token', response.data.token);

        console.info(response.data);
      })
      .catch((e) => {
        toast({
          title: 'Auth Error',
          description: `${e.response.data.message}`,
          variant: 'top-accent',
          status: 'error',
          position: 'top'
        });

        console.info(e.response.data.message);
      });
  };

  return (
    <Center w={`calc(100% + ${config.overallStyle.sidebar.width}px)`} h="100vh">
      <Stack direction="column">
        <div className={stl.authForm}>
          <div className={stl.authTitle}>
            <p
              style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center'
              }}>
              <span style={{ fontWeight: 700 }}>Login</span>

              <span style={{ fontSize: 12, width: '60%', display: 'flex' }}>
                to login you need to enter your token (can be obtained with /api auth) as well as
                your password
              </span>
            </p>
          </div>

          <Divider />

          <div className={stl.authContent}>
            <Stack>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="var(--text-h-c)"
                  fontSize="1.2em"
                  // eslint-disable-next-line react/no-children-prop
                  children={<FaPaperclip color="gray.300" />}
                />
                <Input
                  placeholder="Nickname"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="var(--text-h-c)"
                  fontSize="1.2em"
                  // eslint-disable-next-line react/no-children-prop
                  children={<FaKey color="gray.300" />}
                />
                <Input
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>

              <Button colorScheme="green" onClick={authHandler}>
                Login
              </Button>
            </Stack>
          </div>
        </div>
      </Stack>
    </Center>
  );
};

export default Login;
