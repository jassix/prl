import React, { FC } from 'react';
import RatingTable from '../../components/ratingSort/RatingTable';
import { Center, Stack } from '@chakra-ui/react';
import config from '../../assets/json/config.json';
import RatingBlock from '../../components/ratingSort/RatingBlock';

interface RatingI {
  type: string;
}

const Rating: FC<RatingI> = ({ type }) => {
  var sort = localStorage.getItem('sort');

  console.log(sort);

  // @ts-ignore
  return type === 'solo' ? (
    <>
      <Center
        w={`calc(100% + ${config.overallStyle.sidebar.width}px)`}
        h={'100%'}
        style={{ marginTop: 100 }}>
        <Stack direction={sort == 'table' ? 'column' : 'row'}>
          {sort == 'table' ? <RatingTable /> : <RatingBlock />}
        </Stack>
      </Center>
    </>
  ) : (
    <Center w={`calc(100% - ${config.overallStyle.sidebar.width}px)`}>
      <h1>TEAM</h1>
      <Stack direction={'column'}>
        <RatingTable />
      </Stack>
    </Center>
  );
};

export default Rating;
