import { styled } from "styled-components";

export const Error = styled.div<{ $color?: string }>`
  color: ${(props) => props.$color ? props.$color : 'red'};
  font-size: 0.8rem;
  padding: 0 1px;
`