
import React from 'react';
import { render } from '@testing-library/react-native';
import EditListingModal from './EditListingModal';

describe('EditListingModal', () => {
  const baseProps = {
    visible: true,
    onClose: jest.fn(),
    listing: {
      id: '1',
      title: 'Titre',
      description: 'Description',
      category: 'Catégorie',
      status: 'ACTIVE',
    },
    onSave: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<EditListingModal {...baseProps} />);
  });

  it('displays initial values from listing', () => {
    const { getByDisplayValue } = render(<EditListingModal {...baseProps} />);
    expect(getByDisplayValue('Titre')).toBeTruthy();
    expect(getByDisplayValue('Description')).toBeTruthy();
    expect(getByDisplayValue('Catégorie')).toBeTruthy();
    expect(getByDisplayValue('ACTIVE')).toBeTruthy();
  });

  it('calls onSave with updated values', () => {
    const onSave = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <EditListingModal {...baseProps} onSave={onSave} />
    );
    // Simule la modification du titre
    getByPlaceholderText('Titre').props.onChangeText('Nouveau titre');
    getByPlaceholderText('Description').props.onChangeText('Nouvelle description');
    getByPlaceholderText('Catégorie').props.onChangeText('Nouvelle catégorie');
    getByPlaceholderText('Statut (ACTIVE, RESOLVED, EXPIRED)').props.onChangeText('RESOLVED');
    // Simule le clic sur Enregistrer
    getByText('Enregistrer').props.onPress();
    expect(onSave).toHaveBeenCalledWith({
      title: 'Nouveau titre',
      description: 'Nouvelle description',
      category: 'Nouvelle catégorie',
      status: 'RESOLVED',
    });
  });

  it('calls onClose when Annuler is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <EditListingModal {...baseProps} onClose={onClose} />
    );
    getByText('Annuler').props.onPress();
    expect(onClose).toHaveBeenCalled();
  });
});
