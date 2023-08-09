import { ReactNode, CSSProperties} from 'react';


const MODAL_STYLES: CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'linear-gradient(to top left, rgb(46, 87, 120), rgb(47, 54, 71))',
  padding: '300ppx',
  width:'50%',
  height: '50%',
  borderRadius: '50px'
  
//   zIndex: 1001,
};

const OVERLAY: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backdropFilter: 'blur(4px)',
//   backgroundColor: 'rgba(0,0,0, .7)',
  zIndex: 1000,
};

interface ModalProps {
  children: ReactNode;
  open: Boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  
}

function Modal({ open, children, onClose }: ModalProps) {
  if (!open) return null;
  return (
     <>
      <div style={OVERLAY}>
        {/* <div className='formOverlay'> */}
        <div style={MODAL_STYLES}>
          {/* <div className='formModal'> */}
          <button onClick={onClose}>X</button>
        
         <div> {children} </div>
          
          
        </div>
      </div>
     </>
  );
}

export default Modal;
