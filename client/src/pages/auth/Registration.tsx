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
import { FaKey, FaUserSecret, FaPaperclip } from 'react-icons/fa';
import axios, { AxiosResponse } from 'axios';

const Registration = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const toast = useToast();

  const authHandler = () => {
    axios
      .post('http://localhost:5000/auth/registration', {
        username: token,
        password: password,
        secretKey: secretKey
      })
      .then((response: AxiosResponse<any>) => {
        toast({
          title: 'Auth Info',
          description: `${response.data.message}`,
          variant: 'top-accent',
          status: 'success',
          position: 'top'
        });

        console.info(response.data.message);
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
              <span style={{ fontWeight: 700 }}>Registration</span>

              <span style={{ fontSize: 12, width: '60%', display: 'flex' }}>
                in order to register you need to enter your token (it can be obtained with the /api
                auth command), as well as your password
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
                  placeholder="Token"
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

              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="var(--text-h-c)"
                  fontSize="1.2em"
                  // eslint-disable-next-line react/no-children-prop
                  children={<FaUserSecret color="gray.300" />}
                />
                <Input
                  placeholder="SecretKey (for Admins!)"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </InputGroup>

              <Button colorScheme="green" onClick={authHandler}>
                Register
              </Button>
            </Stack>
          </div>
        </div>
      </Stack>
    </Center>
  );
};

export default Registration;
