const validateForm = (formData, type) => {
    const errors = {};
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    const phone = formData.get('phone');

    if (type === 'login') {
      if (!email) errors.email = 'Email is required';
      if (!password) errors.password = 'Password is required';
    } else if (type === 'register') {
      if (!name) errors.name = 'Name is required';
      if (!email) errors.email = 'Email is required';
      if (!password) errors.password = 'Password is required';
      if (!phone) errors.phone = 'Phone number is required';
    }
    return errors;
  };

  export default validateForm;
