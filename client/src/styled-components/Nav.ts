import { css, styled } from "styled-components";

export const NavLink = styled.div<{ $isActive: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  text-align: left;
  align-items: center;
  gap: 5px;
  padding: 5px 0;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1.8px;
    width: 100%;
    background: linear-gradient(90deg, rgba(30,46,23,1) 13%, rgba(53,109,7,1) 30%, rgba(224,79,3,1) 42%, rgba(230,151,8,1) 69%, rgba(212,121,27,1) 89%);
    transition: 250ms ease-in-out;
    transform: scaleX(0)
  }

  &:hover::after {
    transform: scaleX(1)
  }

  ${(props) => {
    if (props.$isActive) {
      return css`
        font-weight: bold;
        &::after {
          transform: scaleX(1)
        }
      `
    }
  }}
`