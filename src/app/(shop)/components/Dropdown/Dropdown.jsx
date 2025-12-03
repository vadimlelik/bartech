'use client';

import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import styles from './Dropdown.module.css';

const Dropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const contentRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div
        className={classNames(styles.header, { [styles.open]: isOpen })}
        onClick={toggleDropdown}
      >
        <span>{title}</span>
        <span className={styles.icon}>{isOpen ? '▲' : '▼'}</span>
      </div>
      <div
        ref={contentRef}
        className={classNames(styles.content, { [styles.show]: isOpen })}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
