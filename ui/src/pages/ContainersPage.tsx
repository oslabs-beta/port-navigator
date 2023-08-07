import { useNavigate } from 'react-router-dom';

const ContainersPage = () => {
  const nav = useNavigate();
  return (
    <div className='mainContainer'>
    <div className='buttonContainer'>
      <button
        className='button'
        title='Networks'
        onClick={() => nav('/')}>
        Networks
      </button>
    </div>

  </div>
  );
};

export default ContainersPage;