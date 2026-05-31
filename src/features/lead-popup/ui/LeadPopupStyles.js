'use client';

import styled from 'styled-components';

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 16px;
`;

export const PopupContainer = styled.div`
  background: #fff;
  padding: 2rem 1.75rem;
  border-radius: 12px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  position: relative;
  color: #333;
  text-align: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 4px;
  line-height: 1;

  &:hover {
    color: #ff6600;
  }
`;

export const PopupTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: #1a1a1a;
  line-height: 1.3;
`;

export const PopupText = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555;
  margin: 0 0 0.5rem;
`;

export const PopupHighlight = styled.p`
  font-size: 0.875rem;
  line-height: 1.4;
  color: #ff6600;
  font-weight: 500;
  margin: 0 0 1.25rem;
`;

export const PhoneInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.2s ease;
  color: #333;
  box-sizing: border-box;

  &:focus {
    border-color: #ff6600;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: block;
  text-align: left;
`;

export const SubmitButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  background-color: #ff6600;
  color: white;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background-color: #ff8533;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const PrivacyNote = styled.p`
  font-size: 0.75rem;
  color: #999;
  margin: 0.75rem 0 0;
  line-height: 1.4;

  a {
    color: #ff6600;
    text-decoration: underline;
  }
`;

export const SuccessMessage = styled.div`
  padding: 1rem 0;

  h3 {
    font-size: 1.2rem;
    color: #1a1a1a;
    margin: 0 0 0.5rem;
  }

  p {
    font-size: 0.95rem;
    color: #555;
    margin: 0;
  }
`;
