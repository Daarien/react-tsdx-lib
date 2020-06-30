import React from 'react';
import styled, { css } from 'astroturf';

const styles = css`
  .paper {
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
      0px 2px 1px -1px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    padding: 1rem;
  }
`;

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Paper({ children }: PaperProps) {
  return <div className={styles.paper}>{children}</div>;
}
