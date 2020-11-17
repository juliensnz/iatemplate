import styled from 'styled-components';

const IconButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 5px;

  &:hover {
    cursor: pointer;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
`;

const Spacer = styled.div`
  flex: 1;
`;

export {IconButton, ButtonContainer, Spacer};
