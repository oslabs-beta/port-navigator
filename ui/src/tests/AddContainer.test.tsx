import { render, screen } from '@testing-library/react';
import AddContainer from '../components/container-form/AddContainer';

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

describe('Add Container unit tests', () => {
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

  const testProps = {
    network: {
      Driver: 'bridge',
      Name: 'Test Network',
      ID: '0',
      Containers: ['Port Navigator'],
      IPv4Address: ['0.0.0.0'],
    },
    containerList: [
      {
        Id: 'abc',
        Image: 'portNavigator',
        Name: 'Port Navigator',
        Networks: 'Test Network',
        Ports: [portItem],
        State: 'Test',
      },
    ],
    closeAddContainerForm: jest.fn(),
  };

  test('renders the add container form', () => {
    render(<AddContainer {...testProps} />);
    const connectionText = screen.getByText('container to the');
    expect(connectionText).toBeDefined();
  });
});
