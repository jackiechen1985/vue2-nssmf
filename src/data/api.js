import axios from 'axios'
// import Qs from 'qs'

const apiVersion = 'v1'

export default {
  login: data => {
    return axios.post('/api/rest/securityManagement/' + apiVersion + '/oauth/token', data).then(res => res.data)
  },
  logout () {
    return axios.delete('/api/rest/securityManagement/' + apiVersion + '/oauth/token').then(res => res.data)
  },
  findAllScript () {
    return axios.get('/api/rest/provMns/' + apiVersion + '/NSS/Script/list').then(res => res.data)
  },
  deleteScript: scriptName => {
    return axios.delete('/api/rest/provMns/' + apiVersion + '/NSS/Script/' + scriptName).then(res => res.data)
  },
  // localUpload: data => {
  //   return axios.post(
  //     '/api/rest/provMns/' + apiVersion + '/NSS/Script/upload',
  //     data, {
  //       transformRequest: function (data) {
  //         return Qs.stringify(data)
  //       },
  //       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  //     }).then(res => res.data)
  // },
  localUpload: data => {
    return axios.post(
      '/api/rest/provMns/' + apiVersion + '/NSS/Script/upload',
      data, {
        transformRequest: function (data) {
          const fd = new FormData()
          for (const item in data) {
            fd.append(item, data[item])
          }
          return fd
        }
      }
    )
  },
  remoteUpload: data => {
    return axios.post('/api/rest/provMns/' + apiVersion + '/NSS/Script', data).then(res => res.data)
  },
  changePassword: data => {
    return axios.put('/api/rest/securityManagement/' + apiVersion + '/oauth/password', data).then(res => res.data)
  }
}
