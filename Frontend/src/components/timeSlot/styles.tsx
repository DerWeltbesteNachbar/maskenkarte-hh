import styled, { css } from 'styled-components';

export const StyledTimeRestrictionContainer = styled.form`
  ${({ theme }) => css`
    display: flex;
    width: 100%;
    & > * {
      margin: ${theme.spacing(0,1)};
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  `}
`;