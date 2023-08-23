import { useState, SetStateAction, Dispatch } from 'react';

const Checkbox = (props: {
  state: string;
  setState: Dispatch<SetStateAction<string>>;
}) => {
  const [checked, setChecked] = useState(false);
  const handleCheck = () => {
    setChecked(!checked);
  };
  return (
    <li>
      <input type='checkbox' onChange={handleCheck} />
      {checked ? (
        <input
          type='text'
          onChange={e => props.setState(e.target.value)}
          value={props.state}
        />
      ) : (
        props.state
      )}
    </li>
  );
};

export default Checkbox;
