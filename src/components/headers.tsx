import styled from 'styled-components';

export const H1 = styled.h1`
  ${({ center }) =>
    center &&
    `
    margin: 10px auto;
    text-align: center;
  `}
`;
