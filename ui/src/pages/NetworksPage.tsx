// import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// import ContainerDisplay from '../components/ContainerDisplay';
// import AddGateway from '../components/AddGateway';
import Network from '../components/Network';
import {
  ContainerInfo,
  NetworkInfo,
  setContainers,
  setNetworks,
} from '../interfaces/interfaces';
// import { StoreContext } from '../dataStore';
import {
  showAddNetworkForm,
  hideAddNetworkForm,
  addNetworkTest,
} from '../functions/functions';

const NetworksPage = (props: {
  networks: NetworkInfo[] | [];
  containers: ContainerInfo[] | [];
  setContainers: setContainers;
  setNetworks: setNetworks;
}) => {
  const nav = useNavigate();
  const networkEl: JSX.Element[] = [];
  props.networks.forEach((network, i: number) => {
    const networkIndex: String = `network${i}`;
    networkEl.push(
      <Network
        key={`network${i}`}
        networkIndex={networkIndex}
        network={network}
        containers={props.containers}
        setContainers={props.setContainers}
        setNetworks={props.setNetworks}
      />
    );
  });
  // const [gateways, setGateways] = useState([]);
  // const addgateWay = () => {
  //   setGateways(gateways.push())
  //   //   const newGatewayField = <AddGateway />;
  //   //   setGateways(gateways.push(newGatewayField));
  // };

  // ---- set gateways state ----
  // use array destructuring to extract gateways and setGateways from useState passing in an empty array
  // declare a function, addGateway, that accepts one argument, newGateway, a gateway string
  // invoke setGateways passing in the evaluated result of invoking the push method on gateways passing in newGateway

  // ---- handleClick for addGateway button ----
  // declare a function, handleAddGateway, that accepts one argument, an event, e
  // identify the input value using e.target.value
  // invoke addGateway passing in e.target.value

  // const addGatewayButton = document.getElementById('addGatewayButton');

  // addGatewayButton?.addEventListener('click', () => {
  //   handleAddGatewayClick();
  // });

  // const handleAddGatewayClick = () => {
  //   const newGatewayDiv = document.getElementById('addNetworkFormInput');
  //   const newGateway = newGatewayDiv.value;
  //   setGateways(gateways.push(newGateway.value));
  // };

  // NOTE: DEAL WITH THESE TYPESCRIPT ANY TYPES IN THE FUTURE
  const [networkName, setNetworkName] = useState<string>('');
  const [gateways, setGateways] = useState<[] | string[]>([]);
  const [subnets, setSubnets] = useState<[] | string[]>([]);
  const [gatewaysInput, setGatewaysInput] = useState<string>('');
  const [subnetsInput, setSubnetsInput] = useState<string>('');
  const [ipRange, setIpRange] = useState<string>('');

  const handleAddGatewaySubmit = (e: any) => {
    e.preventDefault();
    console.log('gateways', gateways);
    if (e.target) {
      const newGateway = [...gateways, e.target[0].value];

      if (Array.isArray(gateways)) setGateways(newGateway);
      setGatewaysInput('');
    }
  };

  const handleAddSubnetSubmit = (e: any) => {
    e.preventDefault();
    console.log(e.target[0].value);
    if (e.target) {
      const newSubnet = [...subnets, e.target[0].value];

      if (Array.isArray(subnets)) setSubnets(newSubnet);
    }
    setSubnetsInput('');
  };

  // FIX THIS ANY
  const gatewayList: any = [];

  gateways.forEach((currentGateway, i) => {
    gatewayList.push(<li key={i}>{currentGateway}</li>);
  });

  const subnetList: any = [];

  subnets.forEach((currentSubnet, i) => {
    subnetList.push(<li key={i}>{currentSubnet}</li>);
  });

  const clearNetworks = () => {
    console.log('clear networks invoked');
    console.log(gatewayList);
    while (gatewayList.length) {
      gatewayList.pop();
    }
  };

  // look up if we can change submit button lable to add network

  return (
    <div className="mainContainer">
      <div className="buttonContainer">
        <button
          className="button"
          title="Containers"
          onClick={() => nav('containers')}
        >
          Containers
        </button>
      </div>
      <div className="addNetworkButtonContainer">
        <button
          className="addNetworkButton"
          onClick={() => showAddNetworkForm()}
        >
          Add Network
        </button>
      </div>

      <div id="addNetworkForm">
        <div id="closeAddNetworkFormContainer">
          <button
            id="closeAddNetworkFormButton"
            onClick={() =>
              hideAddNetworkForm(
                setNetworkName,
                setGatewaysInput,
                setGateways,
                setSubnetsInput,
                setSubnets,
                setIpRange
              )
            }
          >
            X
          </button>
        </div>
        <div>
          <h1 id="addNetworkFormTitle">Add Network Form</h1>
        </div>
        <br></br>
        <div id="addNetworkNameForm">
          <form>
            <div className="addNetworkTextInput">
              <label htmlFor="networkName" className="addNetworkFormLabel">
                Network Name:{' '}
              </label>
              <input
                type="text"
                placeholder="Add a network name"
                name="networkName"
                className="addNetworkFormInput"
                value={networkName}
                onChange={(e) => {
                  setNetworkName(e.target.value);
                }}
              />
            </div>
          </form>
        </div>
        <br></br>
        <div id="addGatewayForm">
          {/* <form>
            <div className="addNetworkTextInput">
              <label htmlFor="gateway" className="addNetworkFormLabel">
                Gateway:{' '}
              </label>
              <input
                type="text"
                placeholder="Add a gateway"
                name="gateway"
                className="addGatewayFormInput"
                id="addGatewayFormInput"
              />
              <input id="addGatewaySubmitButton" type="submit"></input>
            </div>
          </form> */}
          <form onSubmit={handleAddGatewaySubmit}>
            <div className="addNetworkTextInput">
              <label htmlFor="gateway" className="addNetworkFormLabel">
                Gateway:{' '}
              </label>
              <input
                type="text"
                placeholder="Add a gateway"
                name="gateway"
                className="addGatewayFormInput"
                id="addGatewayFormInput"
                value={gatewaysInput}
                onChange={(e) => {
                  // const newGateways = [];
                  // newGateways.push(e.target.value);
                  setGatewaysInput(e.target.value);
                }}
              />
              <input id="addGatewaySubmitButton" type="submit"></input>
            </div>
          </form>
          <div className="listHeader">
            <span>Added Gateways:</span>
            <span>
              <button onClick={clearNetworks}>Clear Gateways</button>
            </span>
          </div>
          <ul id="currentlyAddedNetworks">{gatewayList}</ul>
        </div>
        <div id="addSubnetForm">
          <form onSubmit={handleAddSubnetSubmit}>
            <div className="addNetworkTextInput">
              <label htmlFor="subnet" className="addNetworkFormLabel">
                Subnetwork:{' '}
              </label>
              <input
                type="text"
                placeholder="Add a subnetwork"
                name="subnet"
                className="addSubnetFormInput"
                id="addSubnetFormInput"
                value={subnetsInput}
                onChange={(e) => setSubnetsInput(e.target.value)}
              />
              <input id="addSubnetSubmitButton" type="submit"></input>
            </div>
          </form>
          <div className="listHeader">
            <span>Added Subnetworks:</span>
            <span>
              <button onClick={clearNetworks}>Clear Subnets</button>
            </span>
          </div>
          <ul id="currentlyAddedNetworks">{subnetList}</ul>
        </div>
        <div id="addIPRangeForm">
          <form>
            <div className="addNetworkTextInput">
              <label htmlFor="ip-range" className="addNetworkFormLabel">
                IP-Range:{' '}
              </label>
              <input
                type="text"
                placeholder="Add an IP-Range"
                name="ip-range"
                className="addNetworkFormInput"
                value={ipRange}
                onChange={(e) => {
                  setIpRange(e.target.value);
                }}
              />
            </div>
          </form>
        </div>
        <div id="containerForAddNetworkFormSubmit">
          <button
            id="submitAddNetworkFormButton"
            onClick={() => {
              addNetworkTest(
                networkName,
                gateways,
                subnets,
                ipRange,
                setNetworkName,
                setGatewaysInput,
                setGateways,
                setSubnetsInput,
                setSubnets,
                setIpRange
              );
            }}
          >
            Add the Network
          </button>
        </div>
      </div>

      {/*  <form>
          <br></br>
          <div id="gatewaysAdded">Gateways Added:</div>
          <br></br>
          <div className="addNetworkTextInput">
            <label htmlFor="ip-range" className="addNetworkFormLabel">
              IP-Range:{' '}
            </label>
            <input
              type="text"
              placeholder="if you wish to include an ip-range, type the address"
              name="ip-range"
              className="addNetworkFormInput"
            />
          </div>
          <br></br>
          <div className="addNetworkTextInput">
            <label htmlFor="subnet" className="addNetworkFormLabel">
              Subnetwork:{' '}
            </label>
            <input
              type="text"
              placeholder="if you wish to include a subnetwork, type the address"
              name="subnet"
              className="addNetworkFormInput"
            />
            <button id="addSubnetButton">Add Subnet</button>
          </div>
          <br></br>
          <div id="subnetworksAdded">Subnetworks Added:</div> */}
      {/* <div>
            <div>
              <strong>Scope</strong>
            </div>
            <div id="addNetworkFormScopeOptions">
              <div className="addNetworkRadioInput">
                <input
                  type="radio"
                  name="ip-range"
                  className="addNetworkFormInput"
                  value="local"
                />
                <label htmlFor="local" className="addNetworkFormLabel">
                  Local
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="ip-range"
                  className="addNetworkFormInput"
                  value="swarm"
                />
                <label htmlFor="swarm" className="addNetworkFormLabel">
                  Swarm
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="ip-range"
                  className="addNetworkFormInput"
                  value="Do not assign a scope to my container"
                />
                <label htmlFor="doNotAssign" className="addNetworkFormLabel">
                  Do not assign a scope to my container
                </label>
              </div>
            </div>
          </div> */}
      {/* <br></br>
          <div>
            <input type="submit"></input>
          </div>
        </form>
      </div> */}
      <div className="hostContainer">
        <h1>Host</h1>
      </div>
      <div className="networksContainer">{networkEl}</div>
    </div>
  );
};

export default NetworksPage;

// const nav = useNavigate();
// const { host, setHost, bridges, setBridges, containers, setContainers } =
//   useContext(StoreContext);
