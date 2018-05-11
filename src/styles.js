export const withPadding = (side = 'both') => `
  ${side === 'both' || side === 'left' ? 'padding-left: 20px;' : ''}
  ${side === 'both' || side === 'right' ? 'padding-right: 20px;' : ''}

  @media (max-width: 1440px) {
    ${side === 'both' || side === 'left' ? 'padding-left: 10px;' : ''}
    ${side === 'both' || side === 'right' ? 'padding-right: 10px;' : ''}
  }
`;