import React from 'react';
import { useCompany } from '../../context/CompanyContext';
import { MetaverseWarRoomView } from '../warroom/MetaverseWarRoomView';

export const MetaverseWarRoomModal: React.FC = () => {
  const { isMeetingModalOpen, setIsMeetingModalOpen } = useCompany();

  if (!isMeetingModalOpen) return null;

  return (
    <MetaverseWarRoomView
      isModal={true}
      onClose={() => setIsMeetingModalOpen(false)}
    />
  );
};
