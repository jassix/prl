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
  TableContainer
} from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import { MainContext } from '../../context/MainContext';

const RatingTable = () => {
  const Context = useContext(MainContext);
  // @ts-ignore
  const players = Context.players;

  console.log(players);

  const playerSort = (a: { rating: number }, b: { rating: number }) => {
    if (a.rating > b.rating) {
      return -1;
    } else if (a.rating < b.rating) {
      return 1;
    } else {
      return 0;
    }
  };

  players.sort(playerSort);

  var playersPosition: number = 1;

  return (
    <TableContainer>
      <Table variant="striped" colorScheme="twitter">
        <TableCaption>Rating Players | Solo</TableCaption>
        <Thead>
          <Tr>
            <Th>Position</Th>
            <Th>Head</Th>
            <Th>Nickname</Th>
            <Th isNumeric>Rating</Th>
          </Tr>
        </Thead>
        <Tbody>
          {players.map((item: { rating: number; username: string }, key: number) => (
            <Tr key={key}>
              <Td>{playersPosition++}</Td>
              <Td>
                <img
                  src={`https://skin.vimeworld.com/head/3d/${item.username}.png`}
                  style={{ width: 35 }}
                />
              </Td>
              <Td>{item.username}</Td>
              <Td isNumeric>{item.rating}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default RatingTable;
