import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContainerDisplay from '../components/ContainerDisplay';
import { ContainerInfo } from '../interfaces/interfaces';

test('renders the container display component with props', () => {
  const containerInfo: ContainerInfo = {
    Name: 'prometheus',
    Id: '123456',
    Image: 'image',
    State: 'running',
    Networks: 'containerwatch_containerwatch-desktop-extension_default',
    Ports: null,
  };

  render(
    <ContainerDisplay
      id={containerInfo.Id}
      info={containerInfo}
      network='bridge'
    />,
  );

  const element = screen.getByText(/prometheus/i);

  expect(element).toBeInTheDocument();
});
