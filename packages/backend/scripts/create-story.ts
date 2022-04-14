import superagent from 'superagent'

export const createStory = async (
  slug: string,
  story: object,
  token: string,
) => {
  const response = await superagent
    .post('0.0.0.0:3000/stories')
    .set({
      authorization: token,
    })
    .send({ slug, story })

  return response.body
}
