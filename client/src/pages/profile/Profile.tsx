import React, { useContext } from 'react';
// @ts-ignore
import Skinview3d from 'react-skinview3d';
import { Center, Stack, SimpleGrid, Button } from '@chakra-ui/react';
import config from '../../assets/json/config.json';
import { MainContext } from '../../context/MainContext';
import { Link } from 'react-router-dom';
import stl from './Profile.module.scss';

const Profile = () => {
  const Context = useContext(MainContext);

  // @ts-ignore
  const playerStats = Context.playerStats;

  return (
    <Center w={`calc(100% + ${config.overallStyle.sidebar.width}px)`} h="100vh">
      <div
        className="profile"
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '1200px',
          height: '500px',
          backgroundColor: 'var(--h-c)',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: 15
        }}>
        <div
          className="skinBlock"
          style={{
            display: 'flex',
            width: '50%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <div
            className="skinPreview"
            style={{
              width: 200,
              height: 400,
              backgroundColor: 'var(--subh-c)',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: 15
            }}>
            <Skinview3d
              skinUrl={`https://skin.vimeworld.com/raw/skin/${localStorage.getItem(
                'nickname'
              )}.png`}
              capeUrl={`https://skin.vimeworld.com/raw/cape/${localStorage.getItem(
                'nickname'
              )}.png`}
              height="400"
              width="400"
            />
          </div>
        </div>

        <div
          className="statsBlock"
          style={{
            height: '100%',
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <div
            className="stats"
            style={{
              display: 'flex',
              width: '100%',
              height: '400px',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}>
            <h1
              style={{
                fontSize: 48,
                fontFamily: 'Poppins',
                fontWeight: 300
              }}>
              STATS
            </h1>
            {playerStats[0] ? (
              <>
                <SimpleGrid columns={2}>
                  <div className={stl.statsItem}>ELO: {playerStats[0]?.rating}</div>
                  <div className={stl.statsItem}>Matches: {playerStats[0]?.matches.length}</div>
                </SimpleGrid>

                <Link to="/profile/history">
                  <Button colorScheme="teal" style={{ marginTop: 15 }}>
                    See match history
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p>You are not in the league</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Center>
  );
};

export default Profile;
