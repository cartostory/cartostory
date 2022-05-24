import axios from 'axios'

const myAxios = axios.create({
  baseURL: '/backend',
  headers: {
    'Content-Type': 'application/json',
  },
})

myAxios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('accessToken')

    if (token) {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      }
    }

    return config
  },
  async error => Promise.reject(error),
)

myAxios.interceptors.response.use(
  res => res,
  async err => {
    const originalConfig = err.config
    if (err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true

        try {
          const accessToken = await Promise.resolve(5)
          window.localStorage.setItem('accessToken', accessToken.toString())
          myAxios.defaults.headers.common.Authorization = accessToken
          return await myAxios(originalConfig)
        } catch (_error) {
          return Promise.reject(_error)
        }
      }
    }

    return Promise.reject(err)
  },
)

export { myAxios }
