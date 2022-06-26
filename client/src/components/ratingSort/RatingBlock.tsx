import React, { useContext } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import stl from './RatingItem.module.scss';
import axios, { AxiosResponse } from 'axios';
import { MainContext } from '../../context/MainContext';

const RatingBlock = () => {
  const Context = useContext(MainContext);
  // @ts-ignore
  const players = Context.players;

  // @ts-ignore
  const discordUsers = Context.discordStats;

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
    <SimpleGrid columns={3} spacing={10} style={{ width: '100%', height: '100%' }}>
      {players.map((item: { rating: number; username: string }, key: number) => (
        <div className={stl.ratingItem} key={key}>
          <div
            className={stl.ratingItemImage}
            style={{
              //backgroundImage: `url("https://cdn.discordapp.com/widget-avatars/M_3IJe5KpQjgvyIJo3pVWcRbS48ZYNjj4u0gZhjuNp4/wrUPIFmG5BP7LzefCUC3cX_CCtz1Chbygo7kwDlsRwgg4BTDOMpaO2fJZsRqXPdGcQ0AKmvGy-2-1P2RvNw804kj8evVckLacT4CxhQrsEdBm0L0AttwWXQgHNagd9Nn0LiL6XTdVSBP2g")`,
              backgroundColor: `#${Math.floor(Math.random() * 900)}`,
              opacity: 0.7,
              height: 'calc(100% / 2)',
              width: '100%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              top: 150,
              borderRadius: '15px 15px 0 0'
            }}></div>

          <div className={stl.ratingItemContent} style={{ color: 'var(--text-h-c)' }}>
            <p>{playersPosition++}</p>
            <p>{item.username}</p>
            <p>{item.rating}</p>
          </div>
        </div>
      ))}
    </SimpleGrid>
  );
};

export default RatingBlock;
