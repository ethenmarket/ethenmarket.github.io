import styled from 'styled-components';

const getBorders = (media, color) => `
  border-left: ${media.left ? `3px solid ${color}` : 'none'};
  border-right: ${media.right ? `3px solid ${color}` : 'none'};
  border-bottom: ${media.bottom ? `3px solid ${color}` : 'none'};
  border-top: ${media.top ? `3px solid ${color}` : 'none'};
`;

const media = (size, styles) => `
  @media (max-width: ${size}) {
    ${styles}
  }
`;

export default styled.div`
  ${props => getBorders(props.media.default, props.theme.borderColor)}
  height: 100%;
  box-sizing: border-box;
  position: relative;

  ${
  props => Object.keys(props.media)
    .map(size => media(size, getBorders(props.media[size], props.theme.borderColor))).join('')
}
`;
