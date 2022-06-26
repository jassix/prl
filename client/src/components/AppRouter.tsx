import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { publicRoutes } from '../utils/routes';
import { MainContext } from '../context/MainContext';

const AppRouter = () => {
  // @ts-ignore
  const Context = useContext(MainContext);

  // @ts-ignore
  const isAuth = Context.tokenValid;

  // @ts-ignore
  const isAdmin = Context.isAdmin;

  // @ts-ignore
  return (
    <Routes>
      {publicRoutes.map(
        (
          item: {
            path: string;
            element?: React.CElement<any, any>;
            hrefInTitle: boolean;
            isDropdown: boolean;
            privacy: string;
            items?: { path: string }[];
          },
          key: number
        ) =>
          isAdmin ? (
            item.isDropdown && !item.hrefInTitle ? (
              <Route key={key} path={item.path} element={item.element}>
                {item.items!.map(
                  (item: { path: string; element?: React.CElement<any, any> }, key: number) => (
                    <Route path={item.path} key={key} element={item.element} />
                  )
                )}
              </Route>
            ) : (
              <Route key={key} path={item.path} element={item.element} />
            )
          ) : isAuth && !isAdmin ? (
            item.isDropdown && !item.hrefInTitle && !item.privacy.includes('admin') ? (
              <Route key={key} path={item.path} element={item.element}>
                {item.items!.map(
                  (item: { path: string; element?: React.CElement<any, any> }, key: number) => (
                    <Route path={item.path} key={key} element={item.element} />
                  )
                )}
              </Route>
            ) : (
              <Route key={key} path={item.path} element={item.element} />
            )
          ) : item.isDropdown && !item.hrefInTitle && item.privacy === 'public' ? (
            <Route key={key} path={item.path} element={item.element}>
              {item.items!.map(
                (item: { path: string; element?: React.CElement<any, any> }, key: number) => (
                  <Route path={item.path} key={key} element={item.element} />
                )
              )}
            </Route>
          ) : (
            <Route key={key} path={item.path} element={item.element} />
          )
      )}
    </Routes>
  );
};

export default AppRouter;
