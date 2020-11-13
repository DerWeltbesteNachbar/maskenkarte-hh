import styled, { css } from 'styled-components';

export const StyledMapContainer = styled.div`
  ${({ theme }) => css`
    height: 75vh;
    position: relative;
    &::before, &::after {
      content: "";
      position: absolute;
      width: 100px;
      height: 1px;
      background: #000;
      left: 50%;
      transform: translateX(-50%);
      top: 50%;
      z-index: 3;
    }
    &::after {
      transform: translateX(-50%) rotateZ(90deg);
    }
  `}
`;