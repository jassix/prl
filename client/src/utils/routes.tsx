import { RiDashboard2Line } from 'react-icons/ri';
import { AiOutlineHome } from 'react-icons/ai';
import { HiOutlineKey } from 'react-icons/hi';
import { FiCompass } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';

import Rating from '../pages/leagues/Rating';
import Registration from '../pages/auth/Registration';
import Login from '../pages/auth/Login';
import Players from '../pages/dashboard/Players';
import Profile from '../pages/profile/Profile';
import GamePage from '../pages/game/GamePage';
import MatchHistory from '../pages/profile/matchHistory/MatchHistory';

export const publicRoutes = [
  {
    title: 'Home',
    path: '/',
    icon: <AiOutlineHome />,
    element: <Rating type={'solo'} />,
    isDropdown: false,
    privacy: 'public',
    show: true,
    hrefInTitle: true,
    items: [{ name: 'Home', absolutePath: '/', path: '/' }]
  },
  {
    title: 'GamePage',
    path: '/game/:id',
    icon: <AiOutlineHome />,
    element: <GamePage />,
    isDropdown: false,
    privacy: 'auth',
    show: false,
    hrefInTitle: false
  },
  {
    title: 'Dashboard',
    path: '/dashboard',
    privacy: 'admin',
    icon: <RiDashboard2Line />,
    isDropdown: true,
    show: true,
    hrefInTitle: false,
    items: [
      {
        name: 'Players',
        absolutePath: `/dashboard/players`,
        path: 'players',
        element: <Players />
      },
      { name: 'Statistic', absolutePath: '/dashboard/statistic', path: 'statistic' }
    ]
  },
  {
    title: 'Auth',
    path: '/auth',
    privacy: 'public',
    show: true,
    icon: <HiOutlineKey />,
    isDropdown: true,
    hrefInTitle: false,
    items: [
      {
        name: 'Registration',
        absolutePath: `/auth/registration`,
        path: 'registration',
        element: <Registration />
      },
      { name: 'Login', absolutePath: '/auth/login', path: 'login', element: <Login /> }
    ]
  },
  {
    title: 'Leagues',
    path: '/leagues',
    privacy: 'public',
    show: true,
    icon: <FiCompass />,
    isDropdown: true,
    hrefInTitle: false,
    items: [
      {
        name: 'Solo League',
        absolutePath: `/leagues/solo`,
        path: 'solo',
        element: <Rating type={'solo'} />
      },
      {
        name: 'Team League',
        absolutePath: '/leagues/team',
        path: 'team',
        element: <Rating type={'team'} />
      }
    ]
  },
  {
    title: 'Profile',
    path: '/profile',
    privacy: 'auth',
    element: <Profile />,
    icon: <CgProfile />,
    isDropdown: false,
    show: true,
    hrefInTitle: true
  },
  {
    title: 'History',
    path: '/profile/history',
    privacy: 'auth',
    show: false,
    element: <MatchHistory />,
    icon: <CgProfile />,
    isDropdown: false,
    hrefInTitle: true
  }
];

// { name: 'Home', path: '/', show: true },
// { name: 'Auth', path: '/auth', show: true },
// { name: 'Rating', path: null, show: true },
// { name: 'Profile', path: '/profile', show: true },
// { name: 'Search', path: '/profile/:nickname', show: false },
// { name: 'Solo League', path: '/league/solo', show: false },
// { name: 'Team League', path: '/league/team', show: false }

export const privateRoutes = [
  {
    name: 'Panel',
    path: '/admin/dashboard',
    icon: <RiDashboard2Line />,
    show: true,
    category: 'Dashboard'
  },
  { name: 'Player Stats', path: '/admin/dashboard/player/:nickname', show: false },
  { name: 'Players', path: '/admin/dashboard/players', show: true, category: 'Dashboard' }
];
