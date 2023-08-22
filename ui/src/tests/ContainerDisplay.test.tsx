import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContainerDisplay from '../components/ContainerDisplay';
import { ContainerInfo, NetworkInfo } from '../interfaces/interfaces';

test('renders the container display component with props', () => {
  const containerInfo: ContainerInfo = {
    Name: 'prometheus',
    Id: '123456',
    Image: 'image',
    State: 'running',
    Networks: 'containerwatch_containerwatch-desktop-extension_default',
    Ports: null,
  };

  const networkInfo: NetworkInfo = {
    Driver: 'bridge',
    Name: 'bridge',
    ID: '1234',
    Containers: [containerInfo.Name],
  };

  render(
    <ContainerDisplay
      id={containerInfo.Id}
      info={containerInfo}
      network={networkInfo}
      containerIndex={1}
    />,
  );

  const element = screen.getByText(/prometheus/i);

  expect(element).toBeInTheDocument();
});
