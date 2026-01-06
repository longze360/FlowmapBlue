import { FC, ReactNode, useEffect, useState } from 'react';
import { LoadingSpinner } from '../core';

export interface Props {
  render?: () => ReactNode;
  children?: ReactNode;
}

const ClientSide: FC<Props> = (props) => {
  const { render, children } = props;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  if (render) {
    return <>{render()}</>;
  }

  return <>{children}</>;
};

export default ClientSide;
