import React, { useContext } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center
} from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import { MainContext } from '../../../context/MainContext';
import { BsClockHistory } from 'react-icons/bs';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import config from '../../../assets/json/config.json';

const MatchHistory = () => {
  const Context = useContext(MainContext);
  // @ts-ignore
  const stats = Context.playerStats;

  console.log(stats);

  return (
    <Center
      w={`calc(100% + ${config.overallStyle.sidebar.width}px)`}
      h="100%"
      style={{ minHeight: '40vh' }}>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Match History | {localStorage.getItem('nickname')}</TableCaption>
          <Thead>
            <Tr>
              <Th>Map</Th>
              <Th>Duration</Th>
              <Th>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              // @ts-ignore
              stats[0]?.matches.map((item: Array<Object, String>, key: number) => (
                <Tr key={key}>
                  <Td>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <FaMapMarkedAlt />
                      <p style={{ marginLeft: 5 }}>{item[0]?.mapName}</p>
                    </span>
                  </Td>
                  <Td>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <BsClockHistory />
                      <p style={{ marginLeft: 5 }}>{(item[0]?.duration / 60).toFixed(1)}m</p>
                    </span>
                  </Td>
                  <Td>
                    {item[0]?.win ? (
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <AiOutlinePlus /> 23 points |
                        <p style={{ color: '--chakra-colors-whatsapp-500', marginLeft: 5 }}>W</p>
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <AiOutlineMinus /> 17 points |
                        <p style={{ color: 'var(--chakra-colors-red-500)', marginLeft: 5 }}>L</p>
                      </span>
                    )}
                  </Td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
      </TableContainer>
    </Center>
  );
};

export default MatchHistory;
