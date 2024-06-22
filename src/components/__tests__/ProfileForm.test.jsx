import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ProfileForm from '../ProfileForm';

test('ProfileForm renders with correct initial values and updates on change', () => {
  const mockSetters = {
    setFirstName: jest.fn(),
    setLastName: jest.fn(),
    setAddressStreet1: jest.fn(),
    setAddressStreet2: jest.fn(),
    setAddressCity: jest.fn(),
    setAddressState: jest.fn(),
    setAddressZip: jest.fn(),
    setLinkedin: jest.fn(),
    setGithub: jest.fn(),
    setPersonalWebsite: jest.fn()
  };

  const initialValues = {
    firstName: 'John',
    lastName: 'Doe',
    addressStreet1: '123 Main St',
    addressStreet2: 'Apt 4B',
    addressCity: 'Anytown',
    addressState: 'CA',
    addressZip: '12345',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    personalWebsite: 'johndoe.com'
  };

  const { getByLabelText } = render(
    <ProfileForm
      firstName={initialValues.firstName}
      setFirstName={mockSetters.setFirstName}
      lastName={initialValues.lastName}
      setLastName={mockSetters.setLastName}
      addressStreet1={initialValues.addressStreet1}
      setAddressStreet1={mockSetters.setAddressStreet1}
      addressStreet2={initialValues.addressStreet2}
      setAddressStreet2={mockSetters.setAddressStreet2}
      addressCity={initialValues.addressCity}
      setAddressCity={mockSetters.setAddressCity}
      addressState={initialValues.addressState}
      setAddressState={mockSetters.setAddressState}
      addressZip={initialValues.addressZip}
      setAddressZip={mockSetters.setAddressZip}
      linkedin={initialValues.linkedin}
      setLinkedin={mockSetters.setLinkedin}
      github={initialValues.github}
      setGithub={mockSetters.setGithub}
      personalWebsite={initialValues.personalWebsite}
      setPersonalWebsite={mockSetters.setPersonalWebsite}
    />
  );

  const firstNameInput = getByLabelText(/First Name/i);
  const lastNameInput = getByLabelText(/Last Name/i);
  
  expect(firstNameInput.value).toBe(initialValues.firstName);
  expect(lastNameInput.value).toBe(initialValues.lastName);

  fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
  fireEvent.change(lastNameInput, { target: { value: 'Smith' } });

  expect(mockSetters.setFirstName).toHaveBeenCalledWith('Jane');
  expect(mockSetters.setLastName).toHaveBeenCalledWith('Smith');
});
