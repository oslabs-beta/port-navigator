// add imports here
import Network from '../components/Network';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// mock the docker extension api client
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

const ddClientMock = jest
  .requireMock('@docker/extension-api-client')
  .createDockerDesktopClient();

// set up the Network tests, clearing mocks and resetting modules before each
describe('Network component unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  // describe props for creating an empty bridge network
  describe('Network', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });

    const emptyBridgeTestProps = {
      network: {
        Driver: 'bridge',
        Name: 'bridge',
        ID: '0',
        Containers: [],
      },
      networkIndex: 0,
      containers: [],
      allNetworks: [],
    };
    const emptyNoneTestProps = {
      network: {
        Driver: 'none',
        Name: 'none',
        ID: '0',
      },
      networkIndex: 0,
      containers: [],
      allNetworks: [],
    };
    const emptyHostTestProps = {
      network: {
        Driver: 'host',
        Name: 'host',
        ID: '0',
      },
      networkIndex: 0,
      containers: [],
      allNetworks: [],
    };
    const singleContainerTestProps = {
      network: {
        Driver: 'bridge',
        Name: 'Test Network',
        ID: '0',
        Containers: ['Port Navigator'],
      },
      networkIndex: 0,
      containers: [
        {
          Id: 'abc',
          Image: 'portNavigator',
          Name: 'Port Navigator',
          Networks: 'Test Network',
          Ports: [],
          State: 'Test',
        },
      ],
      allNetworks: [],
    };
    const multipleContainerTestProps = {
      network: {
        Driver: 'bridge',
        Name: 'Test Network',
        ID: '0',
        Containers: ['Port Navigator', 'Other Container'],
      },
      networkIndex: 0,
      containers: [
        {
          Id: 'abc',
          Image: 'portNavigator',
          Name: 'Port Navigator',
          Networks: 'Test Network',
          Ports: [],
          State: 'Test',
        },
        {
          Id: 'efg',
          Image: 'otherContainer',
          Name: 'Other Container',
          Networks: 'Test Network',
          Ports: [],
          State: 'Test',
        },
      ],
      allNetworks: [],
    };
    // const emptyUserCreatedBridgeProps = {
    //   network: {
    //     Driver: 'bridge',
    //     Name: 'Port Navigator',
    //     ID: '0',
    //     Containers: [],
    //   },
    //   containers: [],
    //   networkIndex: 0,
    //   allNetworks: [],
    // };

    // tests for the network name go here
    test('Should display the network name passed in props', () => {
      render(<Network {...singleContainerTestProps} />);
      const networkName = screen.getByText(/Test Network/);
      expect(networkName).toBeDefined();
    });

    // tests for the disconnect button go here
    test('Should display a disconnect button', () => {
      render(<Network {...emptyBridgeTestProps} />);
      const testDisconnectButton = screen.getByRole('button', {
        name: /x/,
      });
      expect(testDisconnectButton).toBeDefined();
    });

    test('Should prohibit deletion of the pre-generated bridge network', () => {
      render(<Network {...emptyBridgeTestProps} />);
      const testDisconnectButton = screen.getByRole('button', {
        name: /x/,
      });
      fireEvent.click(testDisconnectButton);
      expect(ddClientMock.desktopUI.toast.error).toHaveBeenCalledWith(
        "You can't delete the bridge network!",
      );
    });

    test('Should prohibit deletion of the pre-generated none network', () => {
      render(<Network {...emptyNoneTestProps} />);
      const testDisconnectButton = screen.getByRole('button', {
        name: /x/,
      });
      fireEvent.click(testDisconnectButton);
      expect(ddClientMock.desktopUI.toast.error).toHaveBeenCalledWith(
        "You can't delete the none network!",
      );
    });

    test('Should prohibit deletion of the pre-generated host network', () => {
      render(<Network {...emptyHostTestProps} />);
      const testDisconnectButton = screen.getByRole('button', {
        name: /x/,
      });
      fireEvent.click(testDisconnectButton);
      expect(ddClientMock.desktopUI.toast.error).toHaveBeenCalledWith(
        "You can't delete the host network!",
      );
    });

    test('Should prohibit deletion of user-created networks that hold a single container', () => {
      render(<Network {...singleContainerTestProps} />);
      const testDisconnectButton = screen.getByRole('button', {
        name: /x/,
      });
      fireEvent.click(testDisconnectButton);
      expect(ddClientMock.desktopUI.toast.error).toHaveBeenCalledWith(
        `You can't delete a Network that has Containers attached to it!`,
      );
    });

    test('Should prohibit deletion of user-created networks that hold multiple containers', () => {
      render(<Network {...multipleContainerTestProps} />);
      const testDisconnectButton = screen.getByRole('button', {
        name: /x/,
      });
      fireEvent.click(testDisconnectButton);
      expect(ddClientMock.desktopUI.toast.error).toHaveBeenCalledWith(
        `You can't delete a Network that has Containers attached to it!`,
      );
    });

    // test('Should allow deletion of user-created networks with no containers', async () => {
    //   render(<Network {...emptyUserCreatedBridgeProps} />);
    //   const testDisconnectButton = screen.getByRole('button', {
    //     name: /x/,
    //   });
    //   fireEvent.click(testDisconnectButton);
    //   await ddClientMock.desktopUI.toast.success;
    //   expect(ddClientMock.desktopUI.toast.success).toHaveBeenCalledWith(
    //     'Successfully deleted Network!'
    //   );
    // });

    // tests for the connected containers display go here
    test('Should display the correct number of containers when no containers a present', () => {
      render(<Network {...emptyBridgeTestProps} />);
      const containerNumbers = screen.getByText(0);
      expect(containerNumbers).toBeDefined();
    });

    test('Should display the correct number of containers when one container is present', () => {
      render(<Network {...singleContainerTestProps} />);
      const containerNumbers = screen.getByText(1);
      expect(containerNumbers).toBeDefined();
    });

    test('Should display the connected containers', () => {
      render(<Network {...emptyBridgeTestProps} />);
      const connectedContainersDivider = screen.getByText(/Connected/);
      expect(connectedContainersDivider).toBeDefined();
    });

    test('Should display the correct number of containers when no containers are connected', () => {
      render(<Network {...emptyBridgeTestProps} />);
      const connectedContainersNum = screen.getByText(/0/);
      expect(connectedContainersNum).toBeDefined();
    });

    test('Should display the correct number of containers when one container is connected', () => {
      render(<Network {...singleContainerTestProps} />);
      const connectedContainersNum = screen.getByText(/1/);
      expect(connectedContainersNum).toBeDefined();
    });

    test('Should display the correct number of containers when multiple containers are connected', () => {
      render(<Network {...multipleContainerTestProps} />);
      const connectedContainersNum = screen.getByText(/2/);
      expect(connectedContainersNum).toBeDefined();
    });

    // tests for the show/hide containers button go here
    test('Should not display a show containers button for networks without containers', () => {
      render(<Network {...emptyBridgeTestProps} />);
      const showContainersButton = screen.queryByRole('button', {
        name: /Show Containers/,
      });
      expect(showContainersButton).toBeNull();
    });

    test('Should not display a hide containers button for networks without containters', () => {
      render(<Network {...emptyBridgeTestProps} />);
      const hideContainersButton = screen.queryByRole('button', {
        name: /Hide Containers/,
      });
      expect(hideContainersButton).toBeNull();
    });

    test('Should display a show containers button when the network is first created if the network has containers', () => {
      render(<Network {...singleContainerTestProps} />);
      const showContainersButton = screen.queryByRole('button', {
        name: /Show Containers/,
      });
      expect(showContainersButton).toBeDefined();
    });

    // test('Should display a hide containers button after the show containers button is clicked', () => {
    //   render(<Network {...singleContainerTestProps} />);
    //   const showContainersButton = screen.getByRole('button', {
    //     name: /Show Containers/,
    //   });
    //   fireEvent.click(showContainersButton);
    //   const hideContainersButton = screen.getByText(/Hide Containers/);
    //   expect(hideContainersButton).not.toBeNull();
    // });

    test('Should not have visible containers when the component is initially rendered', () => {
      render(<Network {...singleContainerTestProps} />);
      const containerName = screen.queryByText(/Port Navigator/);
      expect(containerName).not.toBeVisible();
    });

    test('Should make containers visible when the show containers button is clicked', () => {
      render(<Network {...singleContainerTestProps} />);
      const showContainersButton = screen.getByRole('button', {
        name: /Show Containers/,
      });
      const containerName = screen.getByText(/Port Navigator/);
      fireEvent.click(showContainersButton);
      expect(containerName).toBeVisible();
    });

    test('Should make containers invisible when the hide containers button is clicked', () => {
      render(<Network {...singleContainerTestProps} />);
      const showContainersButton = screen.getByRole('button', {
        name: /Show Containers/,
      });
      const containerName = screen.getByText(/Port Navigator/);
      fireEvent.click(showContainersButton);
      fireEvent.click(showContainersButton);
      expect(containerName).not.toBeVisible();
    });

    // tests for the add container button go here
    test('Should display an add container button', () => {
      render(<Network {...emptyBridgeTestProps} />);
      const addContainerButton = screen.getByRole('button', {
        name: /Add Container/,
      });
      expect(addContainerButton).toBeDefined();
    });

    test('Should display the add container form when the add container button is clicked', () => {
      render(<Network {...emptyBridgeTestProps} />);
      const addContainerButton = screen.getByRole('button', {
        name: /Add Container/,
      });
      fireEvent.click(addContainerButton);
      const connectNetworkPhrase = screen.getByText(/container to the/);
      expect(connectNetworkPhrase).toBeDefined();
    });
  });
});
