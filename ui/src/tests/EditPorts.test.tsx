import { render, screen } from '@testing-library/react';
import EditPorts from '../components/container-form/EditPorts';

import '@testing-library/jest-dom';

jest.mock('@docker/extension-api-client', () => ({
  createDockerDesktopClient: jest.fn().mockReturnValue({
    docker: {
      cli: {
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

describe('Edit Ports unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  const portItem = {
    IP: '0.0.0.0',
    PrivatePort: '1111',
    PublicPort: '2222',
    Type: 'tcp',
  };

  const testPortType = new Set('tcp');

  test('renders the container type', () => {
    render(
      <EditPorts
        info={{
          Id: 'abc',
          Image: 'portNavigator',
          Name: 'Port Navigator',
          Networks: 'Test Network',
          Ports: [portItem],
          State: 'Test',
        }}
        portsClose={jest.fn()}
        network="Test Network"
        publicPorts={['2222']}
        privatePorts={['1111']}
        portType={testPortType}
        IPv4Address={'0.0.0.0'}
      />
    );

    const portType = screen.getByText(/tcp/i);

    expect(portType).toBeInTheDocument();
  });

  test('renders the IPv4 Address', () => {
    render(
      <EditPorts
        info={{
          Id: 'abc',
          Image: 'portNavigator',
          Name: 'Port Navigator',
          Networks: 'Test Network',
          Ports: [portItem],
          State: 'Test',
        }}
        portsClose={jest.fn()}
        network="Test Network"
        publicPorts={['2222']}
        privatePorts={['1111']}
        portType={testPortType}
        IPv4Address={'0.0.0.0'}
      />
    );

    const testIPv4Address = screen.getByText(/0.0.0.0/i);

    expect(testIPv4Address).toBeInTheDocument();
  });

  test('renders the published ports', () => {
    render(
      <EditPorts
        info={{
          Id: 'abc',
          Image: 'portNavigator',
          Name: 'Port Navigator',
          Networks: 'Test Network',
          Ports: [portItem],
          State: 'Test',
        }}
        portsClose={jest.fn()}
        network="Test Network"
        publicPorts={['2222']}
        privatePorts={['1111']}
        portType={testPortType}
        IPv4Address={'0.0.0.0'}
      />
    );

    const testPublishedPorts = screen.getByText(/2222/i);

    expect(testPublishedPorts).toBeInTheDocument();
  });

  test('renders the private ports', () => {
    render(
      <EditPorts
        info={{
          Id: 'abc',
          Image: 'portNavigator',
          Name: 'Port Navigator',
          Networks: 'Test Network',
          Ports: [portItem],
          State: 'Test',
        }}
        portsClose={jest.fn()}
        network="Test Network"
        publicPorts={['2222']}
        privatePorts={['1111']}
        portType={testPortType}
        IPv4Address={'0.0.0.0'}
      />
    );

    const testPrivatePorts = screen.getByText(/1111/i);

    expect(testPrivatePorts).toBeInTheDocument();
  });
});
