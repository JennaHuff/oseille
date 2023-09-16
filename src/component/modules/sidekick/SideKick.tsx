import { Flex, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MyH3 } from '../../typography/MyFont';
import { useSideKick } from './SideKickContext';
import { SideKickFeeling } from './enums';

const sideKickColors: { [key in SideKickFeeling]: string } = {
  [SideKickFeeling.GOOD]: 'green',
  [SideKickFeeling.COMPUTE]: 'purple',
  [SideKickFeeling.NEUTRAL]: 'grey',
  [SideKickFeeling.DANGER]: 'red',
  [SideKickFeeling.WARNING]: 'orange',
};

const StyledSentence = styled.div<{ feeling?: SideKickFeeling }>`
  font-size: 1.5rem;
  background-color: #f3fff0;
  position: absolute;
  line-height: 30px;
  border: 3px solid ${({ feeling }) => sideKickColors[feeling || SideKickFeeling.NEUTRAL]};
  border-radius: 20px;
  border-bottom-right-radius: 0;
  padding: 12px;
  bottom: 30px;
  right: 30px;
  width: 300px;
`;

const emojis = ['😃', '😘', '😁', '😅', '😂', '🤣', '😇', '🙃', '🤨', '🥸', '🫣', '😉'];

export function SideKick() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % emojis.length);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const { sentence, emoji, feeling } = useSideKick();

  return (
    <Flex
      alignItems="center"
      position="absolute"
      right="10px"
      gap={4}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      z-index={100}
    >
      {isOpen && <StyledSentence>Bonjour, je suis votre cyber-bénévole, je suis là pour vous aider</StyledSentence>}
      {sentence && <StyledSentence feeling={feeling}>{sentence}</StyledSentence>}
      <MyH3 className="no-select">{emoji || emojis[index]}</MyH3>
    </Flex>
  );
}
