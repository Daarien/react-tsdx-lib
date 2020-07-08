import React from 'react';
import ReactDOM from 'react-dom';
import { ButtonExample } from '../stories/Buttons.stories';

describe('Paper', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ButtonExample id="btns" name="Buttons Example" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
