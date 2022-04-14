import superagent from 'superagent';

export const getToken = async (email: string, password: string) => {
  const response = await superagent
    .post('0.0.0.0:3000/auth/sign-in')
    .send({ email, password });

  return response.body.data;
};
