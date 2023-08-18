import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Addtwo from  '../components/Addtwo'

test('renders the container display component with props', () => { 

render( <Addtwo/>)

const element = screen.getByText(/Hello/i);

  expect(element).toBeInTheDocument();


})