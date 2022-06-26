import React, { FC, useState } from 'react';
import JSX from 'react';
import stl from './SidebarItem.module.scss';
import { CSSTransition } from 'react-transition-group';
import { BsDot } from 'react-icons/bs';
import { Link } from 'react-router-dom';

interface ItemI {
  isDropdown: boolean;
  path: string;
  title: string | Array<string>;
  width: number | string;
  height: number | string;
  hrefInTitle: boolean;
  icon: JSX.CElement<any, any>;
  items?: {
    name: string;
    path: string;
    absolutePath: string;
  }[];
}

const SidebarItem: FC<ItemI> = ({
  isDropdown,
  path,
  hrefInTitle,
  title,
  items,
  width,
  height,
  icon
}) => {
  const [Open, setOpen] = useState(false);

  return (
    <div className={stl.dropdownItem}>
      <div
        className={stl.dropdownTitle}
        style={{
          width: width,
          height: height,
          borderRadius: Open && isDropdown ? '15px 15px 0 0' : '15px'
        }}
        onClick={() => setOpen(!Open)}>
        {hrefInTitle ? (
          <Link to={path}>
            <span
              style={{
                color: 'var(--text-h-c)',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                height: '100%',
                justifyContent: 'center'
              }}>
              {icon} {title}
            </span>
          </Link>
        ) : (
          <span
            style={{
              color: 'var(--text-h-c)',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              height: '100%',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
            {icon} {title}
          </span>
        )}
      </div>

      {isDropdown ? (
        <CSSTransition in={Open} timeout={200} classNames="ddTransition" unmountOnExit>
          <div className={stl.dropdownContent} style={{ display: Open ? 'flex' : 'none' }}>
            {items!.map((item: { absolutePath: string; name: string }, key) => (
              // eslint-disable-next-line react/jsx-key
              <Link to={item.absolutePath} style={{ display: 'flex', width: '100%' }}>
                <div className={stl.dropdownContentItem}>
                  <span
                    key={key}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <BsDot /> {item.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </CSSTransition>
      ) : (
        ''
      )}
    </div>
  );
};

export default SidebarItem;
