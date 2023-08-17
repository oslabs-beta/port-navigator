import { ReactNode, CSSProperties } from 'react';

const OVERLAY: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backdropFilter: 'blur(4px)',
  //   backgroundColor: 'rgba(0,0,0, .7)',
  zIndex: 1000,
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

interface ModalProps {
  children: ReactNode;
  open: Boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

function FormModal({ open, children, onClose }: ModalProps) {
  if (!open) return null;
  return (
    <>
      <div style={OVERLAY} className='blur'>
        <div /*style={MODAL_STYLES}*/ className='modalContainer'>
          <button className='deleteNetworkButton' onClick={onClose}>
            x
          </button>

          {children}
        </div>
      </div>
    </>
  );
}

export default FormModal;
