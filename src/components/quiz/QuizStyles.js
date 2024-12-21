'use client'
import styled from 'styled-components'

export const QuizOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const QuizContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  position: relative;
  color: #333;

  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
`

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  padding: 5px;
  line-height: 1;

  &:hover {
    color: #ff6600;
  }
`

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 1rem;
  overflow: hidden;
`

export const ProgressBar = styled.div`
  height: 100%;
  background: #ff6600;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`

export const QuestionContainer = styled.div`
  margin-bottom: 1.5rem;
  color: #333;
`

export const InputContainer = styled.div`
  margin-top: 1rem;
`

export const RadioContainer = styled.div`
  margin-bottom: 1rem;
`

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: all 0.3s ease;
  background: ${props => props.$isChecked ? '#ff6600' : '#fff'};
  color: ${props => props.$isChecked ? '#fff' : '#333'};
  border-color: ${props => props.$isChecked ? '#ff6600' : '#ccc'};
  margin-bottom: 0.5rem;
  font-size: 1rem;

  &:hover {
    border-color: #ff6600;
    background: ${props => props.$isChecked ? '#ff6600' : '#fff8f3'};
  }
`

export const CheckboxContainer = styled.div`
  margin-bottom: 1rem;
`

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: all 0.3s ease;
  position: relative;
  background: ${props => props.$isChecked ? '#ff6600' : '#fff'};
  color: ${props => props.$isChecked ? '#fff' : '#333'};
  border-color: ${props => props.$isChecked ? '#ff6600' : '#ccc'};
  margin-bottom: 0.5rem;
  font-size: 1rem;

  &:hover {
    border-color: #ff6600;
    background: ${props => props.$isChecked ? '#ff6600' : '#fff8f3'};
  }
`

export const CustomInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border 0.3s ease;
  color: #333;

  &:focus {
    border-color: #ff6600;
    outline: none;
  }

  &::placeholder {
    color: #999;
  }
`

export const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
`

export const Navigation = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`

export const NavButton = styled.button`
  background-color: #ff6600;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    background-color: #ff8533;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`
