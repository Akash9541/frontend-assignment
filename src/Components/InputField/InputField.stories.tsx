import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import InputField, { InputFieldProps } from './InputField';

export default {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible, modern input field component with multiple variants and states.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    loading: { control: 'boolean' },
    showClearButton: { control: 'boolean' },
  },
} as Meta<typeof InputField>;

const Template: StoryFn<InputFieldProps> = (args) => (
  <div className="w-80">
    <InputField {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  label: 'Full Name',
  placeholder: 'Enter your full name',
  helperText: 'This will be displayed on your profile',
};

export const Filled = Template.bind({});
Filled.args = {
  variant: 'filled',
  label: 'Email Address',
  placeholder: 'you@example.com',
  type: 'email',
};

export const Outlined = Template.bind({});
Outlined.args = {
  variant: 'outlined',
  label: 'Username',
  placeholder: 'Choose a username',
  helperText: 'Must be 3-20 characters long',
};

export const Ghost = Template.bind({});
Ghost.args = {
  variant: 'ghost',
  label: 'Search',
  placeholder: 'Type to search...',
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Email',
  placeholder: 'Enter your email',
  value: 'invalid-email',
  invalid: true,
  errorMessage: 'Please enter a valid email address',
};

export const Password = Template.bind({});
Password.args = {
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  helperText: 'Must be at least 8 characters',
};

export const WithClearButton = Template.bind({});
WithClearButton.args = {
  label: 'Search Query',
  placeholder: 'Type your search...',
  value: 'Sample text',
  showClearButton: true,
};

export const Loading = Template.bind({});
Loading.args = {
  label: 'Processing...',
  placeholder: 'Please wait',
  loading: true,
  value: 'Saving changes',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Read Only Field',
  value: 'This field is disabled',
  disabled: true,
  helperText: 'This field cannot be edited',
};

export const Sizes = () => (
  <div className="space-y-6 w-80">
    <InputField
      size="sm"
      label="Small Input"
      placeholder="Small size input"
    />
    <InputField
      size="md"
      label="Medium Input"
      placeholder="Medium size input (default)"
    />
    <InputField
      size="lg"
      label="Large Input"
      placeholder="Large size input"
    />
  </div>
);

export const Variants = () => (
  <div className="space-y-6 w-80">
    <InputField
      variant="filled"
      label="Filled Variant"
      placeholder="Filled background style"
      helperText="Subtle background with clean look"
    />
    <InputField
      variant="outlined"
      label="Outlined Variant"
      placeholder="Traditional outlined style"
      helperText="Classic border styling (default)"
    />
    <InputField
      variant="ghost"
      label="Ghost Variant"
      placeholder="Minimal ghost style"
      helperText="Transparent until focused"
    />
  </div>
);

export const States = () => (
  <div className="space-y-6 w-80">
    <InputField
      label="Normal State"
      placeholder="Normal input state"
      value="Sample text"
    />
    <InputField
      label="Focus State"
      placeholder="Click to see focus state"
      helperText="Beautiful focus ring animation"
    />
    <InputField
      label="Error State"
      placeholder="Invalid input"
      value="invalid@"
      invalid={true}
      errorMessage="This email format is incorrect"
    />
    <InputField
      label="Loading State"
      placeholder="Processing..."
      loading={true}
      value="Saving..."
    />
    <InputField
      label="Disabled State"
      placeholder="Cannot interact"
      disabled={true}
      value="Disabled field"
    />
  </div>
);

export const AllFeatures = () => {
  const [values, setValues] = React.useState({
    name: '',
    email: '',
    password: '',
    search: 'Sample search query'
  });

  const [errors, setErrors] = React.useState({
    email: false,
    password: false
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Simple validation
    if (field === 'email') {
      setErrors(prev => ({
        ...prev,
        email: e.target.value.length > 0 && !e.target.value.includes('@')
      }));
    }
    if (field === 'password') {
      setErrors(prev => ({
        ...prev,
        password: e.target.value.length > 0 && e.target.value.length < 6
      }));
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Create Account
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Interactive form with all InputField features
        </p>
      </div>

      <InputField
        label="Full Name"
        placeholder="Enter your full name"
        value={values.name}
        onChange={handleChange('name')}
        variant="outlined"
        size="md"
      />

      <InputField
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={values.email}
        onChange={handleChange('email')}
        variant="outlined"
        invalid={errors.email}
        errorMessage={errors.email ? 'Please enter a valid email address' : undefined}
        helperText={!errors.email ? 'We\'ll never share your email' : undefined}
      />

      <InputField
        label="Password"
        type="password"
        placeholder="Choose a strong password"
        value={values.password}
        onChange={handleChange('password')}
        variant="outlined"
        invalid={errors.password}
        errorMessage={errors.password ? 'Password must be at least 6 characters' : undefined}
        helperText={!errors.password ? 'Must be at least 6 characters long' : undefined}
      />

      <InputField
        label="Search"
        placeholder="Search anything..."
        value={values.search}
        onChange={handleChange('search')}
        variant="filled"
        showClearButton={true}
      />

      <button
        disabled={!values.name || !values.email || !values.password || errors.email || errors.password}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
      >
        Create Account
      </button>
    </div>
  );
};