import React from 'react';

import Modal from '../modal';
import { useModal } from '../../hooks/use-modal';

import image from '../../../../assets/images/logo192.png';
import share from '../../../../assets/images/AppleShare.png';

import './pwa.scss';

export const InstallPWA = () => {
  const [modalOpen, setModalOpen] = useModal();

  React.useEffect(() => { setModalOpen(true); }, []);

  return (
    <Modal
      isActive={modalOpen}
      className="notification-card"
    >
      <div className="modal-container modal-container-small modal-flex modal-flex-middle modal-flex-center modal-height-1-1" style={{ height: '100%' }}>
        <div style={{ maxWidth: '400px' }} className="modal-card modal-card-default modal-card-body">
          <div style={{ marginTop: '-50px' }} className="modal-text-center">
            <img src={image} className="modal-border-rounded" height="72" width="72" alt="Install PWA" />
          </div>
          <div className="modal-margin-top modal-text-center">
            <h3>Install WOD Land!</h3>
          </div>
          <p className="modal-h4 modal-text-muted modal-text-center modal-margin-remove-top">
            Install this application on your homescreen for a better experience.
          </p>
          <div className="modal-text-center">
            <p className="modal-text-small">
              Tap
              <img
                src={share}
                style={{ margin: 'auto 4px 8px' }}
                className="modal-display-inline-block"
                alt="Add to homescreen"
                height="20"
                width="20"
              />
              then &quot;Add to Home Screen&quot;
            </p>
          </div>
          <button type="button" className="modal-button modal-button-link modal-link-muted" onClick={() => setModalOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InstallPWA;
