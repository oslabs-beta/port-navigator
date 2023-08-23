//add imports here
import NetworksPage from '../pages/NetworksPage';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// mocks go here if needed
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

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// set up NetworkPage tests, clearing mocks and restarting modules before each
describe('NetworkPage unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  describe('Network', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });
    // description of props goes here
    const userCreatedNetworks = {
      networks: [
        {
          Driver: 'bridge',
          Name: 'Bridge',
          ID: 'A',
        },
        {
          Driver: 'host',
          Name: 'host',
          ID: 'B',
        },
        {
          Driver: 'none',
          Name: 'null',
          ID: 'C',
        },
        {
          Driver: 'bridge',
          Name: 'Eg1',
          ID: 'D',
        },
        {
          Driver: 'bridge',
          Name: 'Eg2',
          ID: 'E',
        },
        {
          Driver: 'bridge',
          Name: 'Eg3',
          ID: 'F',
        },
      ],
    };

    const containers = [
      {
        Name: 'containertest',
        Id: 'rjsfjs',
        Image: 'containertest',
        State: 'running',
        Networks: 'none',
        Ports: null,
      },
    ];
    const noUserCreatedNetworksProps = {
      networks: [
        {
          Driver: 'bridge',
          Name: 'Bridge',
          ID: 'A',
        },
        {
          Driver: 'host',
          Name: 'host',
          ID: 'B',
        },
        {
          Driver: 'none',
          Name: 'null',
          ID: 'C',
          Containers: ['Port Navigator'],
        },
      ],
      containers: [
        {
          Id: 'abc',
          Image: 'portNavigator',
          Name: 'Port Navigator',
          Networks: 'Test Network',
          Ports: null,
          State: 'Test',
        },
      ],
    };
    // Should display a containers (later a visualizer) button
    test('Should display a Visualizer button on initial render', () => {
      render(<NetworksPage {...noUserCreatedNetworksProps} />);
      const visualizerButton = screen.getByRole('button', {
        name: /Visualizer/,
      });
      expect(visualizerButton).toBeDefined();
    });

    // Should switch to containers/visualizer page when containers/visualizer button is clicked
    // test('Should switch to Visualizer page when Visualizer button is clicked', () => {
    //   render(<NetworksPage {...noUserCreatedNetworksProps} />);
    //   const visualizerButton = screen.getByRole('button', {
    //     name: /Visualizer/,
    //   });
    //   fireEvent.click(visualizerButton);
    //   const addNetworkButton = screen.getByRole('button', {
    //     name: /Add Network/,
    //   });
    //   expect(addNetworkButton).not.toBeDefined();
    // });

    // Containers/visualizer button should switch to Networks button when Containers/visualizer button is clicked
    // test('Should switch Visualizer button to Networks button when Visualizer button is clicked', () => {
    //   render(<NetworksPage {...noUserCreatedNetworksProps} />);
    //   const visualizerButton = screen.getByRole('button', {
    //     name: /Visualizer/,
    //   });
    //   fireEvent.click(visualizerButton);
    //   const networksButton = screen.getByRole('button', {
    //     name: /Networks/,
    //   });
    //   expect(networksButton).toBeDefined();
    // });

    // Should switch to networks page when Networks button is clicked
    // test('Should switch to Networks page when Networks button is clicked', () => {
    //   render(<NetworksPage {...noUserCreatedNetworksProps} />);
    //   const visualizerButton = screen.getByRole('button', {
    //     name: /Visualizer/,
    //   });
    //   fireEvent.click(visualizerButton);
    //   const addNetworkButton = screen.getByRole('button', {
    //     name: /Add Network/,
    //   });
    //   expect(addNetworkButton).toBeDefined();
    // });

    // Should display an Add Network button
    test('Should display an Add Network button', () => {
      render(<NetworksPage {...noUserCreatedNetworksProps} />);
      const addNetworkButton = screen.getByRole('button', {
        name: /Add Network/,
      });
      expect(addNetworkButton).toBeDefined();
    });

    // Should display Add Network Form on click of Add Network button
    test('Should display an Add Network form when the Add Network button is clicked', () => {
      render(<NetworksPage {...noUserCreatedNetworksProps} />);
      const addNetworkButton = screen.getByRole('button', {
        name: /Add Network/,
      });
      fireEvent.click(addNetworkButton);
      const addNetworkFormText = screen.getByText(/Advanced network settings/);
      expect(addNetworkFormText).toBeVisible();
    });

    // Should display a close Add Network Form button
    test('Should display an Add Network Form Close button when the Add Network button is clicked', () => {
      render(<NetworksPage {...noUserCreatedNetworksProps} />);
      const addNetworkButton = screen.getByRole('button', {
        name: /Add Network/,
      });
      fireEvent.click(addNetworkButton);
      const addNetworkFormCloseButtonArray = screen.queryAllByRole('button', {
        name: /x/,
      });
      expect(addNetworkFormCloseButtonArray.length).toEqual(4);
    });

    // Should close Add Network Form on click of Close Add Network Form button
    test('Should closelose Add Network form when the Close Add Network Form button is clicked', () => {
      render(<NetworksPage {...noUserCreatedNetworksProps} />);
      const addNetworkButton = screen.getByRole('button', {
        name: /Add Network/,
      });
      fireEvent.click(addNetworkButton);
      const addNetworkFormCloseButtonArray = screen.queryAllByText(/x/);
      fireEvent.click(addNetworkFormCloseButtonArray[3]);
      const addNetworkFormText = screen.queryByText(
        'Advanced network settings'
      );
      expect(addNetworkFormText).toBeNull();
    });

    // Should display a host at the top (not a network)
    test('Should display a Host at the top of the page', () => {
      render(<NetworksPage {...noUserCreatedNetworksProps} />);
      const Host = screen.getByText(/Host/);
      expect(Host).toBeDefined();
    });

    // Should display a bridge network, a host network, and a none network if no user created networks are passed in as props
    test('renders bridge network if no user created props are passed in as props', () => {
      render(<NetworksPage {...noUserCreatedNetworksProps} />);
      const networkName = screen.getByText(/Bridge/);
      expect(networkName).toBeInTheDocument();
    });

    test('renders none network if no user created props are passed in as props', () => {
      render(<NetworksPage {...noUserCreatedNetworksProps} />);
      const noneNetworkText = screen.getByText(/none/);
      expect(noneNetworkText).toBeDefined();
    });

    test('renders host network if no user created props are passed in as props', () => {
      render(<NetworksPage {...noUserCreatedNetworksProps} />);
      const hostTextArray = screen.queryAllByText(/host/);
      expect(hostTextArray.length).toEqual(2);
    });

    // Should display multiple user-created networks in addition to bridge, host, and none networks if multiple user-created networks are passed in as props
    test('renders none network if it is provided  as props', () => {
      render(<NetworksPage {...userCreatedNetworks} containers={containers} />);
      const noneNetworkText = screen.getByText(/none/);
      expect(noneNetworkText).toBeDefined();
    });

    test('renders host network if it is provided  as props', () => {
      render(<NetworksPage {...userCreatedNetworks} containers={containers} />);
      const hostTextArray = screen.queryAllByText(/host/);
      expect(hostTextArray.length).toEqual(2);
    });

    test('renders bridge network if it is provided  as props', () => {
      render(<NetworksPage {...userCreatedNetworks} containers={containers} />);
      const networkName = screen.getByText(/Bridge/);
      expect(networkName).toBeInTheDocument();
    });

    test('renders user created network if it is provided  as props', () => {
      render(<NetworksPage {...userCreatedNetworks} containers={containers} />);
      const networkName = screen.getByText(/Eg1/);
      expect(networkName).toBeInTheDocument();
    });

    test('renders a second user created network if it is provided  as props', () => {
      render(<NetworksPage {...userCreatedNetworks} containers={containers} />);
      const networkName = screen.getByText(/Eg2/);
      expect(networkName).toBeInTheDocument();
    });

    test('renders a third user created network if it is provided  as props', () => {
      render(<NetworksPage {...userCreatedNetworks} containers={containers} />);
      const networkName = screen.getByText(/Eg3/);
      expect(networkName).toBeInTheDocument();
    });
  });
});
