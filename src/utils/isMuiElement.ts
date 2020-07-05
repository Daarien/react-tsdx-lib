import React from 'react';
import { StandardProps } from '..';

export interface NamedMuiElement {
  type: React.ComponentType & { name: string };
  props: StandardProps<{}, never>;
  key: string | number | null;
}

export default function isMuiElement(
  element: NamedMuiElement | any,
  names: string[]
): element is NamedMuiElement {
  console.log(
    'isMuiElement => element has name',
    React.isValidElement(element) && names.indexOf((element as NamedMuiElement).type.name)
  );

  return (
    React.isValidElement(element) && names.indexOf((element as NamedMuiElement).type.name) !== -1
  );
}
