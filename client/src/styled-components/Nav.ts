import { css, styled } from "styled-components";

export const NavLink = styled.div<{ $isActive: boolean }>`
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background-color: black;
    transition: 200ms ease-in-out;
    transform: scaleX(0)
  }

  &:hover::after {
    transform: scaleX(1)
  }

  &:hover {
    color: black;
  }

  ${(props) => {
    if (props.$isActive) {
      return css`
        color: black;
        &::after {
          transform: scaleX(1)
        }
      `
    }

    return css`
      color: gray;
    `
  }}
`