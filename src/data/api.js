import axios from 'axios'
// import Qs from 'qs'
import $ from 'jquery'
import vm from '../main.js'

// Axios拦截器
axios.delete.withCredentials = false
// axios.defaults.headers.common.accessToken = undefined
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.interceptors.request.use(config => {
  const token = window.sessionStorage.getItem('token')
  if (token) {
    config.headers.common.accessToken = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  console.log(response.data)
  return response
}, error => {
  switch (error.response.status) {
    case 401: invalidSession()
  }
  return Promise.reject(error)
})

// Session过期，重定向登录页面
function invalidSession () {
  vm.$alert('登录过期，请重新登录！', ' 登录过期', {
    confirmButtonText: '确定',
    type: 'warning',
    callback: () => {
      vm.$router.push('/login')
    }
  })
}

// blob文件下载
function download (res) {
  const type = res.headers['content-type']
  const blob = new Blob([res.data], { type: type }) // 将会被放入到blob中的数组内容的MIME类型
  const contentDisposition = res.headers['content-disposition']
  const filename = decodeURIComponent(contentDisposition.split(';')[1].split('filename=')[1])
  if (window.navigator.msSaveOrOpenBlob) { // msSaveOrOpenBlob方法返回bool值
    window.navigator.msSaveBlob(blob, filename) // 本地保存
  } else {
    const a = document.createElement('a')
    a.download = filename // 自定义下载文件名称
    a.style = 'none'
    a.href = URL.createObjectURL(blob)
    $('body').append(a) // 修复 firefox 中无法触发 click
    a.click()
    URL.revokeObjectURL(a.href)
    $(a).remove()
  }
}

// API版本号
const apiVersion = 'v1'

export default {
  login: data => {
    return axios.post('/api/rest/securityManagement/' + apiVersion + '/oauth/token', data).then(res => res.data)
  },
  logout () {
    return axios.delete('/api/rest/securityManagement/' + apiVersion + '/oauth/token').then(res => res.data)
  },
  findAllDesignNsst () {
    return axios.get('/api/rest/provMns/' + apiVersion + '/nssts/design/list').then(res => res.data)
  },
  findAllRuntimeNsst () {
    return axios.get('/api/rest/provMns/' + apiVersion + '/nssts/runtime/list').then(res => res.data)
  },
  uploadDesignNsst: data => {
    return axios.post(
      '/api/rest/provMns/' + apiVersion + '/nssts/design/upload',
      data, {
        transformRequest: function (data) {
          const fd = new FormData()
          for (const item in data) {
            fd.append(item, data[item])
          }
          return fd
        }
      })
  },
  uploadRuntimeNsst: data => {
    return axios.post(
      '/api/rest/provMns/' + apiVersion + '/nssts/runtime/upload',
      data, {
        transformRequest: function (data) {
          const fd = new FormData()
          for (const item in data) {
            fd.append(item, data[item])
          }
          return fd
        }
      })
  },
  downloadNsst: data => {
    return axios.post('/api/rest/provMns/' + apiVersion + '/nssts/download',
      data, {
        responseType: 'blob'
      }).then(res => download(res))
  },
  deleteNsst: data => {
    return axios.request({
      method: 'delete',
      url: '/api/rest/provMns/' + apiVersion + '/nssts/delete',
      data: data
    }).then(res => res.data)
  },
  publishDesignNsst: nsstId => {
    return axios.post('/api/rest/provMns/' + apiVersion + '/nssts/publish' + '?nsstId=' + nsstId).then(res => res.data)
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
  localUploadScript: data => {
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
  remoteUploadScript: data => {
    return axios.post('/api/rest/provMns/' + apiVersion + '/NSS/Script', data).then(res => res.data)
  },
  changePassword: data => {
    return axios.put('/api/rest/securityManagement/' + apiVersion + '/oauth/password', data).then(res => res.data)
  }
}
