import React, { createContext, useState, useEffect, FC } from 'react';
import axios, { AxiosResponse } from 'axios';

interface ContextI {
  children: React.ReactNode;
}

// @ts-ignore
export const MainContext = createContext();

export const Context: FC<ContextI> = ({ children }) => {
  const [validToken, setValidToken] = useState([]);
  const [role, setRole] = useState([]);
  const [players, setPlayers] = useState([]);
  const [vimeOnline, setVimeOnline] = useState([]);
  const [discordStats, setDiscordStats] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);

  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', 'TOKENANETYYEBAN');
  }

  useEffect(() => {
    axios
      .get('http://localhost:7000/auth/compareToken', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then((response: AxiosResponse) => {
        setValidToken(response.data.message);
        console.log(response.data);
      })
      .catch((e) => {
        setValidToken(e.response.data.message);
        console.log(e);
      });

    axios
      .get(`http://localhost:7000/game/player/${localStorage.getItem('nickname')}`)
      .then((response: AxiosResponse) => {
        setPlayerStats(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        setPlayerStats(e.response.data);
        console.log(e);
      });

    axios
      .get('http://localhost:7000/auth/compareRole', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then((response: AxiosResponse) => {
        setRole(response.data.message);
        console.log(response.data);
      })
      .catch((e) => {
        setRole(e.response.data.message);
        console.log(e);
      });

    axios
      .get(`http://localhost:7000/game/players`)
      .then((response: AxiosResponse) => {
        setPlayers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    axios
      .get('https://api.vimeworld.com/online')
      .then((response) => {
        setVimeOnline(response.data.total);
      })
      .catch((e) => {
        console.log(e);
      });

    axios
      .get('https://discord.com/api/guilds/975350356450115584/widget.json')
      .then((response) => {
        setDiscordStats(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  console.info(
    `TOKEN: ${validToken}, ADMIN: ${role}, PLAYERS: ${
      players.length
    }, VIMEWORLD ONLINE: ${vimeOnline}, DISCORD STATS: FULFILLED, PLAYER STATS: ${
      localStorage.getItem('nickname') !== null || undefined ? 'FULFILLED' : 'BAD REQUEST'
    }`
  );

  return (
    <MainContext.Provider
      value={{
        tokenValid: validToken,
        players: players,
        vimeOnline: vimeOnline,
        discordStats: discordStats,
        isAdmin: role,
        playerStats: playerStats
      }}>
      {children}
    </MainContext.Provider>
  );
};
