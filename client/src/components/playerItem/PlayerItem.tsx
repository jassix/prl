import React, { FC } from 'react';
import stl from './PlayerItem.module.scss';

interface PlayerItemI {
  name: string;
  team: string;
}

const PlayerItem: FC<PlayerItemI> = ({ name, team }) => {
  return (
    <div
      className={stl.playerItem}
      style={team === 'blue' ? { backgroundColor: '#65a6db' } : { backgroundColor: '#db6565' }}>
      <div className={stl.head}>
        <img src={`https://skin.vimeworld.com/head/3d/${name}.png`} />
      </div>

      <div className={stl.nickname}>{name}</div>
    </div>
  );
};

export default PlayerItem;
