import { useState } from 'react';
import { hideAddNetworkForm, AddNetwork } from '../functions/functions';
import { NetworkInfo, setNetworks } from '../interfaces/interfaces';

const NetworkForm = (props: {
  networks: NetworkInfo[] | [];
  setNetworks: setNetworks;
}) => {
  const [networkName, setNetworkName] = useState<string>('');
  const [gateway, setGateway] = useState<string>('');
  const [subnet, setSubnet] = useState<string>('');
  const [ipRange, setIpRange] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);

  function handleCheck(): void {
    if (disabled) setDisabled(false);
    else {
      setDisabled(true);
      setGateway('');
      setSubnet('');
      setIpRange('');
    }
  }

  //TODO: clear might not be working?
  return (
    <div id='addNetworkForm'>
      <div id='closeAddNetworkFormContainer'>
        <button
          id='closeAddNetworkFormButton'
          onClick={() =>
            hideAddNetworkForm(
              setNetworkName,
              setGateway,
              setSubnet,
              setIpRange,
              setDisabled,
            )
          }>
          X
        </button>
      </div>
      <div>
        <h1 id='addNetworkFormTitle'>Create Network Form</h1>
      </div>
      <br></br>
      <div id='addNetworkNameForm'>
        <div className='addNetworkTextInput'>
          <label htmlFor='networkName' className='addNetworkFormLabel'>
            Network Name:{' '}
          </label>
          <input
            type='text'
            placeholder='Add a network name'
            name='networkName'
            className='addNetworkFormInput'
            value={networkName}
            onChange={e => {
              setNetworkName(e.target.value);
            }}
          />
        </div>
      </div>
      <br />
      <div className='addNetworkCheckbox'>
        <input
          type='checkbox'
          name='advancedSettings'
          className='addSubnetFormInput'
          checked={!disabled}
          onChange={() => handleCheck()}></input>
        <label htmlFor='advancedSettings' className='addNetworkFormLabel'>
          Advanced network settings
        </label>
      </div>
      <div id='addSubnetForm'>
        <div className='addNetworkTextInput'>
          <input
            type='text'
            placeholder='Add a subnetwork (optional)'
            name='subnet'
            className='addSubnetFormInput'
            id='addSubnetFormInput'
            value={subnet}
            disabled={disabled}
            onChange={e => setSubnet(e.target.value)}
          />
          <label htmlFor='subnet' className='addNetworkFormLabel'>
            Subnetwork:{' '}
          </label>
        </div>
      </div>
      <div id='addGatewayForm'>
        <div className='addNetworkTextInput'>
          <input
            type='text'
            placeholder='Add a gateway (optional)'
            name='gateway'
            className='addGatewayFormInput'
            id='addGatewayFormInput'
            value={gateway}
            disabled={subnet.length ? false : true}
            onChange={e => {
              setGateway(e.target.value);
            }}
          />
          <label htmlFor='gateway' className='addNetworkFormLabel'>
            Gateway:{' '}
          </label>
        </div>
      </div>
      <div id='addIPRangeForm'>
        <form>
          <div className='addNetworkTextInput'>
            <input
              type='text'
              placeholder='Add an IP-Range (optional)'
              name='ip-range'
              className='addNetworkFormInput'
              value={ipRange}
              disabled={subnet.length ? false : true}
              onChange={e => {
                setIpRange(e.target.value);
              }}
            />
            <label htmlFor='ip-range' className='addNetworkFormLabel'>
              IP-Range:{' '}
            </label>
          </div>
        </form>
      </div>
      <div id='containerForAddNetworkFormSubmit'>
        <button
          id='submitAddNetworkFormButton'
          onClick={() => {
            AddNetwork(
              networkName,
              props.networks,
              props.setNetworks,
              gateway,
              subnet,
              ipRange,
              setNetworkName,
              setGateway,
              setSubnet,
              setIpRange,
              setDisabled,
            );
          }}>
          Create Network
        </button>
      </div>
    </div>
  );
};

export default NetworkForm;
