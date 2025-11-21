


export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateAmount = (amount) => {
  return !isNaN(amount) && amount >= 0;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]{8,}$/;
  return phoneRegex.test(phone);
};