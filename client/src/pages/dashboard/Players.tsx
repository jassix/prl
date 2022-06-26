import React, { useContext, useState } from 'react';
import {
  Center,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  StatGroup,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select
} from '@chakra-ui/react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import config from '../../assets/json/config.json';
import axios, { AxiosResponse } from 'axios';
import { MainContext } from '../../context/MainContext';
import RatingBlock from '../../components/ratingSort/RatingBlock';

const Players = () => {
  const Context = useContext(MainContext);
  // @ts-ignore
  const players = Context.players;

  const sortPlayers = (a: { rating: number }, b: { rating: number }) => {
    if (a.rating > b.rating) {
      return 1;
    } else if (b.rating > a.rating) {
      return -1;
    } else {
      return 0;
    }
  };
  players.sort(sortPlayers);

  const [nickname, setNickname] = useState('');
  const [rating, setRating] = useState(1000);
  const { isOpen, onOpen, onClose } = useDisclosure();

  var today = new Date();

  return (
    <Center
      w={`calc(100% + ${config.overallStyle.sidebar.width}px)`}
      style={{ minHeight: '90vh', height: '100%' }}>
      <Stack direction="column" style={{ textAlign: 'center' }}>
        <div className="statBlock" style={{ marginTop: 150 }}>
          <div className="headingStats" style={{ display: 'flex', flexDirection: 'row' }}>
            <div
              className="statSubBlock"
              style={{
                backgroundColor: 'var(--h-c)',
                borderRadius: '15px 15px 0px 0px',
                width: '100%',
                height: '150px',
                display: 'flex',
                alignItems: 'center'
              }}>
              <Stat>
                <StatLabel>All Players</StatLabel>
                <StatNumber>{players.length}</StatNumber>
                <StatHelpText>
                  01.05 - {today.toLocaleDateString('ru-RU').slice(0, -5)}
                </StatHelpText>
              </Stat>
            </div>
          </div>

          <div className="middleStats" style={{ display: 'flex', flexDirection: 'row' }}>
            <LineChart
              style={{ backgroundColor: 'var(--h-c)', borderRadius: '0px 0 0 15px' }}
              width={850}
              height={400}
              data={players}
              margin={{ top: 30, right: 50, bottom: 15, left: 5 }}>
              <Line type="monotone" dataKey="rating" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="username" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip />
            </LineChart>

            <iframe
              // @ts-ignore
              src={`https://discord.com/widget?id=975350356450115584&theme=${localStorage.getItem(
                'theme'
              )}`}
              width="350"
              height="400"
              // @ts-ignore
              allowTransparency="true"
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              style={{ borderRadius: '0 0px 15px 0px' }}></iframe>
          </div>
        </div>

        <Divider style={{ opacity: 1, marginTop: 35, marginBottom: 35 }} />

        <Button colorScheme="teal" onClick={onOpen}>
          Control
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Control Panel</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="modalControl">
                <Select placeholder="Select Player">
                  {players.map((item: { username: string }, key: number) => (
                    <option
                      key={key}
                      value={item.username}
                      onClick={() => setNickname(item.username)}>
                      {item.username}
                    </option>
                  ))}
                </Select>

                <NumberInput
                  defaultValue={rating}
                  min={0}
                  max={15000}
                  step={250}
                  // @ts-ignore
                  onChange={(value) => setRating(value)}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" mr={1} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Divider style={{ opacity: 1, marginTop: 35, marginBottom: 35 }} />
      </Stack>
    </Center>
  );
};

export default Players;
