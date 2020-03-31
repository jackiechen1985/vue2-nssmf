import Vue from 'vue'

/* Common Objects */
var Events = new Vue({})
var es = null

export default {
  NSSI: 'NSSI',
  DESIGN_NSST: 'DESIGN_NSST',
  RUNTIME_NSST: 'RUNTIME_NSST',
  Script: 'Script',

  send: notify => {
    Events.$emit('notify-' + notify.type, notify)
  },
  on: (type, fnOrChangeType, fn) => {
    if (typeof (fnOrChangeType) === 'function') {
      Events.$on('notify-' + type, fnOrChangeType)
    } else {
      Events.$on('notify-' + type, notify => {
        if (notify.changeType === fnOrChangeType) {
          fn(notify)
        }
      })
    }
  },
  off: (type, fn) => {
    Events.$off('notify-' + type, fn)
  },
  startSSE () {
    if (typeof (EventSource) !== 'undefined') {
      es = new EventSource('/gui/notification')
      es.onopen = () => {}
      es.onmessage = (e) => {
        if (e.data === 'hb') {
          return
        }
        console.log('notification: ' + e.data)
        try {
          const notify = JSON.parse(e.data)
          this.send(notify)
        } catch (e) {
          console.error('notification error (' + e + ') at ' + new Date().toLocaleString())
        }
      }
      es.onerror = () => {
        console.error('notification error (' + es.readyState + ') at ' + new Date().toLocaleString())
      }
    } else {
      Events.$message.error('当前浏览器不支持服务器发送的事件')
    }
  },
  stopSSE () {
    es.close()
  }
}
