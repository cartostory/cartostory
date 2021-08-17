export type User = {
  id: string;
  email: string;
  display_name: string;
  password: string;
  signup_date: Date;
  activation_date: Date;
  last_login_date: Date;
  status: 'registered' | 'verified' | 'deleted';
};

export type UserActivationCode = {
  user_id: string;
  activation_code: string;
  generated_date: Date;
  valid_until_date: Date;
  used_date: Date;
};
