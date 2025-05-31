export const validateEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};

export const validatePassword = (password) => {
   // Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one special character
   const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
   return passwordRegex.test(password);
};

export const validateName = (name) => {
   return name.length >= 2 && /^[a-zA-Z\s-]+$/.test(name);
};

export const getPasswordStrength = (password) => {
   let strength = 0;

   if (password.length >= 8) strength++;
   if (/[A-Z]/.test(password)) strength++;
   if (/[a-z]/.test(password)) strength++;
   if (/\d/.test(password)) strength++;
   if (/[!@#$%^&*]/.test(password)) strength++;

   return {
      score: strength,
      message: getStrengthMessage(strength),
   };
};

const getStrengthMessage = (strength) => {
   switch (strength) {
      case 0:
      case 1:
         return "Very weak";
      case 2:
         return "Weak";
      case 3:
         return "Medium";
      case 4:
         return "Strong";
      case 5:
         return "Very strong";
      default:
         return "";
   }
};

export const validateConfirmPassword = (password, confirmPassword) => {
   return password === confirmPassword;
};

export const validateLoginForm = (values) => {
   const errors = {};

   if (!values.email) {
      errors.email = "Email is required";
   } else if (!validateEmail(values.email)) {
      errors.email = "Invalid email address";
   }

   if (!values.password) {
      errors.password = "Password is required";
   }

   return errors;
};

export const validateSignupForm = (values) => {
   const errors = {};

   if (!values.firstName) {
      errors.firstName = "First name is required";
   } else if (!validateName(values.firstName)) {
      errors.firstName = "Invalid first name";
   }

   if (!values.lastName) {
      errors.lastName = "Last name is required";
   } else if (!validateName(values.lastName)) {
      errors.lastName = "Invalid last name";
   }

   if (!values.email) {
      errors.email = "Email is required";
   } else if (!validateEmail(values.email)) {
      errors.email = "Invalid email address";
   }

   if (!values.password) {
      errors.password = "Password is required";
   } else if (!validatePassword(values.password)) {
      errors.password =
         "Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one special character";
   }

   if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
   } else if (
      !validateConfirmPassword(values.password, values.confirmPassword)
   ) {
      errors.confirmPassword = "Passwords do not match";
   }

   if (!values.acceptTerms) {
      errors.acceptTerms = "You must accept the terms and conditions";
   }

   return errors;
};
