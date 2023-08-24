import { useState } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { useAppStore } from '../store';
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

const NetworkForm = (props: { closeAddNetworkForm: Function }) => {
  const [networkName, setNetworkName] = useState<string>('');
  const [gateway, setGateway] = useState<string>('');
  const [subnet, setSubnet] = useState<string>('');
  const [ipRange, setIpRange] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const { networks, incForce } = useAppStore(store => {
    return {
      networks: store.networks,
      incForce: store.incForce,
    };
  });

  const ddClient = useDockerDesktopClient();

  const handleCheck = (): void => {
    if (disabled) setDisabled(false);
    else {
      setDisabled(true);
      setGateway('');
      setSubnet('');
      setIpRange('');
    }
  };

  const AddNetwork = async (closeAddNetworkForm: Function) => {
    let exists = false;
    for (const network of networks) {
      if (network.Name === networkName) exists = true;
    }
    if (!exists) {
      const commandArr = [networkName];
      commandArr.push(`--subnet=${subnet}`);
      commandArr.push(`--gateway=${gateway}`);
      commandArr.push(`--ip-range=${ipRange}`);

      await ddClient.docker.cli.exec('network create', commandArr);

      incForce();
    } else {
      ddClient.desktopUI.toast.error(
        `The ${networkName} network already exists!`,
      );
    }
    hideAddNetworkForm();
    closeAddNetworkForm();
  };

  const hideAddNetworkForm = () => {
    const addNetworkForm = document.getElementById('addNetworkForm');
    if (addNetworkForm !== null) {
      setNetworkName('');
      setGateway('');
      setSubnet('');
      setIpRange('');
      setDisabled(true);
      addNetworkForm.style.display = 'none';
    }
  };

  return (
    <div id='addNetworkForm'>
      <div id='addNetworkNameForm'>
        <h2 id='addNetworkFormTitle'>Add Network</h2>
        <div className='addNetworkTextInput'>
          <label htmlFor='networkName' className='addNetworkFormLabel labelFieldName'>
            Name:{' '}
          </label>
          <input
            type='text'
            placeholder='Add a network name'
            name='networkName'
            className='addNetworkFormInput inputFieldName'
            value={networkName}
            onChange={e => {
              setNetworkName(e.target.value);
            }}
          />
        </div>
      </div>
      <hr className='formhr' />
      <div className='addNetworkCheckbox'>
        <input
          type='checkbox'
          name='advancedSettings'
          className='addSubnetFormInput chk'
          checked={!disabled}
          onChange={() => handleCheck()}></input>
        <label htmlFor='advancedSettings' className='addNetworkFormLabel labelField'>
          Advanced network settings
        </label>
      </div>
      <hr className='formhr' />
      <div className='netconfig'>
      <div id='addSubnetForm'>
        <div className='addNetworkTextInput'>
          <input
            type='text'
            placeholder='Add a subnetwork (optional)'
            name='subnet'
            className='addSubnetFormInput inputField'
            id='addSubnetFormInput'
            value={subnet}
            disabled={disabled}
            onChange={e => setSubnet(e.target.value)}
          />
          <label htmlFor='subnet' className='addNetworkFormLabel labelField'>
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
            className='addGatewayFormInput inputField'
            id='addGatewayFormInput'
            value={gateway}
            disabled={subnet.length ? false : true}
            onChange={e => {
              setGateway(e.target.value);
            }}
          />
          <label htmlFor='gateway' className='addNetworkFormLabel labelField'>
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
              className='addNetworkFormInput inputField'
              value={ipRange}
              disabled={subnet.length ? false : true}
              onChange={e => {
                setIpRange(e.target.value);
              }}
            />
            <label htmlFor='ip-range' className='addNetworkFormLabel labelField'>
              IP-Range:{' '}
            </label>
          </div>
        </form>
      </div>
      </div>
      <div id='containerForAddNetworkFormSubmit'>
        <button
          id='submitAddNetworkFormButton'
          className='innerButton'
          onClick={() => {
            AddNetwork(props.closeAddNetworkForm);
          }}>
          Create Network
        </button>
      </div>
    </div>
  );
};

export default NetworkForm;
