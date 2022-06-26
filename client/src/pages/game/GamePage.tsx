import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios, { AxiosResponse } from 'axios';
import { Button, Center, Stack, useToast } from '@chakra-ui/react';
import config from '../../assets/json/config.json';
import PlayerItem from '../../components/playerItem/PlayerItem';

const GamePage = () => {
  const { id } = useParams();
  const toast = useToast();

  // @ts-ignore
  const [data, setData]: { startedTime: number } = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/game/map/${id}`)
      .then((response: AxiosResponse) => {
        setData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const gameExpired = () => {
    toast({
      position: 'top',
      status: 'error',
      title: 'Game expired',
      description: `Game expired, link has been deleted!`,
      variant: 'top-accent'
    });
  };

  var expired = Date.now() > data?.startedTime + 3600000;

  return (
    data?.players && (
      <Center w={`calc(100% + ${config.overallStyle.sidebar.width}px)`} h="100vh">
        <Stack direction="column" style={{ justifyContent: 'center' }} w="50%">
          <div
            className="titleBlock"
            style={{
              // @ts-ignore
              position: 'top',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Stack direction="row">
              {expired ? (
                <a>
                  <Button colorScheme="green" onClick={gameExpired}>
                    Connect
                  </Button>
                </a>
              ) : (
                <a href={data?.discordLink} target="__blank">
                  <Button colorScheme="green">Connect</Button>
                </a>
              )}
            </Stack>
          </div>

          <div
            className="mainBlock"
            style={{ display: 'flex', justifyContent: 'space-around', width: '500x' }}>
            <Stack direction="column">
              <h1 style={{ fontSize: 24, textAlign: 'center' }}>RED TEAM</h1>
              <PlayerItem name={data?.players[0]?.nickname} team="red" />
              <PlayerItem name={data?.players[1]?.nickname} team="red" />
              <PlayerItem name={data?.players[2]?.nickname} team="red" />
              <PlayerItem name={data?.players[3]?.nickname} team="red" />
            </Stack>

            <Stack direction="column">
              <div
                className="mapName"
                style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <p>{data?.mapName}</p>
              </div>
            </Stack>

            <Stack direction="column">
              <h1 style={{ fontSize: 24, textAlign: 'center' }}>BLUE TEAM</h1>
              <PlayerItem name={data?.players[4]?.nickname} team="blue" />
              <PlayerItem name={data?.players[5]?.nickname} team="blue" />
              <PlayerItem name={data?.players[6]?.nickname} team="blue" />
              <PlayerItem name={data?.players[7]?.nickname} team="blue" />
            </Stack>
          </div>
        </Stack>
      </Center>
    )
  );
};

export default GamePage;
