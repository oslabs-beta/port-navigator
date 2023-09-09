import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';
import ContainerDisplay from '../components/ContainerDisplay';
import { NetworkInfo } from '../interfaces/interfaces';

jest.mock('@docker/extension-api-client', () => ({
  createDockerDesktopClient: jest.fn().mockReturnValue({
    docker: {
      clie: {
        exec: jest.fn(),
      },
    },
    desktopUI: {
      toast: {
        error: jest.fn(),
        success: jest.fn(),
        warning: jest.fn(),
      },
    },
  }),
}));

describe('Container component unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  const portItem = {
    IP: '0.0.0.0',
    PrivatePort: '9090',
    PublicPort: '9090',
    Type: 'tcp',
  };
  const containerInfoWithPorts = {
    Name: 'prometheus',
    Id: '123456',
    Image: 'image',
    State: 'running',
    Networks: 'containerwatch_containerwatch-desktop-extension_default',
    Ports: [portItem],
  };

  const containerInfoWithoutPorts = {
    Name: 'prometheus',
    Id: '123456',
    Image: 'image',
    State: 'running',
    Networks: 'containerwatch_containerwatch-desktop-extension_default',
    Ports: [],
  };

  const networkInfo: NetworkInfo = {
    Driver: 'bridge',
    Name: 'bridge',
    ID: '1234',
    Containers: [containerInfoWithPorts.Name],
    IPv4Address: ['0.0.0.0'],
  };

  test('renders the container display component without port information', () => {
    render(
      <ContainerDisplay
        id={containerInfoWithoutPorts.Id}
        info={containerInfoWithoutPorts}
        network={networkInfo}
        containerIndex={0}
      />,
    );

    const element = screen.getByText(/prometheus/i);

    expect(element).toBeInTheDocument();
  });

  test('does not render any port information if there is no port info to be rendered', () => {
    render(
      <ContainerDisplay
        id={containerInfoWithoutPorts.Id}
        info={containerInfoWithoutPorts}
        network={networkInfo}
        containerIndex={0}
      />,
    );

    const element = screen.queryByText(/PrivatePort/i);

    expect(element).not.toBeInTheDocument();
  });

  test('renders the container display component with port information', () => {
    render(
      <ContainerDisplay
        id={containerInfoWithPorts.Id}
        info={containerInfoWithPorts}
        network={networkInfo}
        containerIndex={0}
      />,
    );

    const portElement = screen.getByText(/Private Ports/);

    const containerElement = screen.getByText(/image/);

    expect(portElement).toBeInTheDocument();
    expect(containerElement).toBeInTheDocument();
  });

  test('renders formModal if the connect button is clicked', () => {
    render(
      <ContainerDisplay
        id={containerInfoWithoutPorts.Id}
        info={containerInfoWithoutPorts}
        network={networkInfo}
        containerIndex={0}
      />,
    );
    const buttonElement = screen.getByRole('button', {
      name: 'Connect to Networks',
    });
    fireEvent.click(buttonElement);

    const outputElement = screen.getByText(/Container to a Network/);
    expect(outputElement).toBeVisible();
  });
  test('Does not render formModal if the connect button is not clicked', () => {
    render(
      <ContainerDisplay
        id={containerInfoWithoutPorts.Id}
        info={containerInfoWithoutPorts}
        network={networkInfo}
        containerIndex={0}
      />,
    );

    const outputElement = screen.queryByText(/Container to a Network/);
    expect(outputElement).not.toBeInTheDocument();
  });
});
