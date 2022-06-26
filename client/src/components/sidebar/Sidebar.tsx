import React, { useState, useEffect, useContext } from 'react';
import stl from './Sidebar.module.scss';
import config from '../../assets/json/config.json';
import { MdPeople, MdPeopleOutline, MdNotifications } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import axios from 'axios';
import Logo from '../../assets/images/PL.svg';
import SidebarItem from '../sidebarItem/SidebarItem';
import { publicRoutes } from '../../utils/routes';
import {
  Button,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { FaSun, FaPlay, FaMoon } from 'react-icons/fa';
import { AiOutlineBlock } from 'react-icons/ai';
import { useToast } from '@chakra-ui/react';
import { MainContext } from '../../context/MainContext';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme'));
  const [sort, setSort] = useState(localStorage.getItem('sort'));
  const [inGame, setInGame] = React.useState(false);
  const [gameID, setGameID] = useState('');
  const [gameInfo, setGameInfo] = useState([]);
  const [online, setOnline] = useState([]);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const startGame = () => {
    const socket = io('http://localhost:5001');
    socket.on('connect', async () => {
      socket.on('inGame', (response) => {
        setInGame(response);
      });

      // @ts-ignore
      await socket.emit('connectToGame', [
        { id: socket.id },
        { nickname: localStorage?.getItem('nickname') }
      ]);

      await socket.on('connectToGame', (data, gameID) => {
        console.log(data);
        setGameInfo(data.data);
        setGameID(data.gameID);
        //setTotalPlayers(data.players)
        //setPlayersNicknames(data[1].nickname
      });
    });
  };

  useEffect(() => {
    const socketOnline = io('http://localhost:5002');
    // @ts-ignore
    socketOnline.on('connect', async () => {
      await socketOnline.emit('connectToServer', {
        id: socketOnline.id,
        nickname: localStorage?.getItem('nickname')
      });

      await socketOnline.on('connectToServer', (data) => {
        console.log(data);
        setOnline(data);
      });
    });
  }, []);

  console.log(gameID, online);

  // @ts-ignore
  const Context = useContext(MainContext);

  // @ts-ignore
  const isAuth = Context.tokenValid;
  // @ts-ignore
  const isAdmin = Context.isAdmin;
  // @ts-ignore
  const vimeOnline = Context.vimeOnline;
  // @ts-ignore
  const leagueOnline = Context.players.length;
  // @ts-ignore
  const playerStats = Context.playerStats;

  const toast = useToast();

  const ThemeHandler = () => {
    if (localStorage.getItem('theme') == 'dark') {
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  const reloadPage = () => {
    setTimeout(() => {
      location.reload();
      // @ts-ignore
    }, [1000]);
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    toast({
      position: 'top',
      status: 'success',
      title: 'Logout',
      description: 'You logout from account, reload page...',
      variant: 'top-accent'
    });

    reloadPage();
  };

  const SortHandler = () => {
    if (localStorage.getItem('sort') == 'block') {
      localStorage.setItem('sort', 'table');
      setSort('table');
    } else {
      localStorage.setItem('sort', 'block');
      setSort('block');
    }

    toast({
      position: 'top',
      status: 'success',
      title: 'Success',
      description: `Sort changed on ${localStorage.getItem('sort')}, reload page...`,
      variant: 'top-accent'
    });

    reloadPage();
    console.log(sort);
  };

  const redirectPage = (url: string) => {
    // eslint-disable-next-line no-constant-condition
    if ((url !== '' || undefined) && gameInfo.length >= 8) {
      setTimeout(() => {
        window.location.replace(`http://localhost:3000/game/${url}`);
        // @ts-ignore
      }, [1000]);
    } else {
      return null;
    }
  };

  redirectPage(gameID);

  // @ts-ignore
  document
    .querySelector('.head')
    .setAttribute('style', `color-scheme: ${localStorage.getItem('theme')}`);
  // @ts-ignore
  document.querySelector('.head').setAttribute('data-theme', `${localStorage.getItem('theme')}`);
  // @ts-ignore
  document.body.setAttribute('class', localStorage.getItem('theme'));

  // @ts-ignore
  return (
    <>
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selection of players</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Connected players: {gameInfo.length} | Left: {8 - gameInfo.length}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onEditClose}>
              Close
            </Button>

            <Link to={`/game/${gameID}`}>
              <Button>Redirect</Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              ONLINE: {online.length}
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="onlineItemsWrapper" style={{ display: 'flex', flexDirection: 'row' }}>
              {online.map((item: { id: string; nickname: string }, key: number) => (
                <div
                  key={key}
                  className="onlineItem"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '5px',
                    width: 50
                  }}>
                  <div className="onlineImg">
                    <img
                      src={`https://skin.vimeworld.com/head/3d/${item.nickname}.png`}
                      style={{ width: 50 }}
                    />
                  </div>
                  <div className="onlineNickname">
                    <span>{item.nickname}</span>
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={'40%'} onClick={onDeleteClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <nav
        className={stl.navbar}
        style={{
          backgroundColor: 'var(--h-c)',
          width: `calc(100% - ${config.overallStyle.sidebar.width}px)`,
          height: 71,
          position: 'fixed',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1000,
          right: 0,
          left: 270,
          borderBottom: '1px solid rgba(173, 173, 173, 0.2)'
        }}>
        <div
          className="navInner"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
          <div
            className={stl.navStats}
            style={{
              display: 'flex',
              flexDirection: 'row'
            }}>
            <p
              style={{
                color: 'var(--text-h-c)',
                display: 'flex',
                alignItems: 'center',
                marginRight: 15
              }}>
              <MdPeople /> {vimeOnline}
            </p>

            <p style={{ color: 'var(--text-h-c)', display: 'flex', alignItems: 'center' }}>
              <MdPeopleOutline /> {leagueOnline}
            </p>
          </div>

          <div className={stl.navLogo}>
            <p style={{ color: 'var(--text-h-c)' }}>
              <img src={Logo} style={{ width: 35, opacity: 0.2 }} />
            </p>
          </div>

          <div className={stl.navAdditional}>
            <IconButton
              onClick={inGame !== false ? onEditOpen : startGame}
              style={
                localStorage.getItem('theme') === 'dark'
                  ? { backgroundColor: 'var(--subh-c)', color: 'var(--text-h-c)' }
                  : { backgroundColor: 'var(--bg-c)', color: 'var(--text-h-c)' }
              }
              aria-label="Start play"
              icon={<FaPlay />}
            />
            <IconButton
              className={stl.navSort}
              onClick={onDeleteOpen}
              style={
                localStorage.getItem('theme') === 'dark'
                  ? { backgroundColor: 'var(--subh-c)', color: 'var(--text-h-c)' }
                  : { backgroundColor: 'var(--bg-c)', color: 'var(--text-h-c)' }
              }
              aria-label="Change Sort"
              icon={<HiOutlineStatusOnline />}
            />
            <IconButton
              className={stl.navSort}
              onClick={SortHandler}
              style={
                localStorage.getItem('theme') === 'dark'
                  ? { backgroundColor: 'var(--subh-c)', color: 'var(--text-h-c)' }
                  : { backgroundColor: 'var(--bg-c)', color: 'var(--text-h-c)' }
              }
              aria-label="Change Sort"
              icon={<AiOutlineBlock />}
            />

            {isAuth ? (
              <>
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      style={
                        localStorage.getItem('theme') === 'dark'
                          ? { backgroundColor: 'var(--subh-c)', color: 'var(--text-h-c)' }
                          : { backgroundColor: 'var(--bg-c)', color: 'var(--text-h-c)' }
                      }
                      className={stl.navProfile}
                      aria-label="Profile"
                      icon={<CgProfile />}
                    />
                  </PopoverTrigger>
                  <PopoverContent style={{ backgroundColor: 'var(--h-c)' }}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader
                      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <img
                        src={`https://skin.vimeworld.com/head/${localStorage.getItem(
                          'nickname'
                        )}.png`}
                        style={{ borderRadius: '25%', width: 30 }}
                      />

                      <p style={{ marginLeft: 10, fontSize: 18 }}>
                        {localStorage.getItem('nickname')}
                      </p>
                    </PopoverHeader>
                    <PopoverBody>ELO: {playerStats[0]?.rating}</PopoverBody>
                  </PopoverContent>
                </Popover>

                <Button
                  leftIcon={<FiLogOut />}
                  onClick={logoutHandler}
                  style={
                    localStorage.getItem('theme') === 'dark'
                      ? { backgroundColor: 'var(--subh-c)', color: 'var(--text-h-c)' }
                      : { backgroundColor: 'var(--bg-c)', color: 'var(--text-h-c)' }
                  }>
                  Logout
                </Button>
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </nav>
      <nav
        style={{
          backgroundColor: 'var(--h-c)',
          width: config.overallStyle.sidebar.width,
          zIndex: 1001,
          height: '100vh',
          position: 'fixed',
          borderBottom: '1px solid rgba(173, 173, 173, 0.2)'
        }}>
        <div
          className="topNavbar"
          style={{
            height: 71,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderBottom: '1px solid rgba(173, 173, 173, 0.2)'
          }}>
          <div
            className="topNavbarContent"
            style={{
              height: 71 - 10 * 2,
              borderRadius: 15,
              width: 'calc(100% - 10% * 2)',
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              backgroundColor: 'var(--subh-c)'
            }}>
            <img
              src={`https://skin.vimeworld.com/head/${localStorage.getItem('nickname')}.png`}
              style={{ width: 30, borderRadius: '25%' }}
            />

            <span style={{ color: 'var(--text-h-c)' }}>{localStorage.getItem('nickname')}</span>
          </div>
        </div>

        <div
          className={stl.content}
          style={{
            height: '85%',
            borderBottom: '1px solid rgba(173, 173, 173, 0.2)',
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: 'scroll',
            overflowX: 'hidden'
          }}>
          <div>
            {publicRoutes.map(
              // @ts-ignore
              (
                item: {
                  isDropdown: boolean;
                  path: string;
                  title: string;
                  privacy: string;
                  show: boolean;
                  icon: React.CElement<any, any>;
                  items?: { name: string; path: string; absolutePath: string }[];
                  hrefInTitle: boolean;
                },
                key: number
              ) =>
                isAdmin && item.show ? (
                  <SidebarItem
                    key={key}
                    isDropdown={item.isDropdown}
                    title={item.title}
                    width={220}
                    path={item.path}
                    height={60}
                    hrefInTitle={item.hrefInTitle}
                    items={item.items}
                    icon={item.icon}
                  />
                ) : // eslint-disable-next-line no-constant-condition
                isAuth && !isAdmin && item.show && !item.privacy.includes('admin') ? (
                  <SidebarItem
                    key={key}
                    isDropdown={item.isDropdown}
                    title={item.title}
                    width={220}
                    path={item.path}
                    height={60}
                    hrefInTitle={item.hrefInTitle}
                    items={item.items}
                    icon={item.icon}
                  />
                ) : item.privacy === 'public' && item.show ? (
                  <SidebarItem
                    key={key}
                    isDropdown={item.isDropdown}
                    title={item.title}
                    width={220}
                    path={item.path}
                    height={60}
                    hrefInTitle={item.hrefInTitle}
                    items={item.items}
                    icon={item.icon}
                  />
                ) : (
                  ''
                )
            )}
          </div>
        </div>

        <div
          className="footerNavbar"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '8%'
          }}>
          <Button
            style={
              localStorage.getItem('theme') === 'dark'
                ? { backgroundColor: 'var(--subh-c)', color: 'var(--text-h-c)' }
                : { backgroundColor: 'var(--bg-c)', color: 'var(--text-h-c)' }
            }
            leftIcon={localStorage.getItem('theme') === 'dark' ? <FaSun /> : <FaMoon />}
            onClick={ThemeHandler}>
            Theme
          </Button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
