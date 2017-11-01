<template>
  <div class="wrapper">
    <div class="selectes">
      <div class="select-wrapper">
        <Input v-model="remoteOrigin"></Input>
      </div>
      <div class="select-wrapper">
        <i-select v-model="queryParams.username" placeholder="username" clearable>
          <i-option v-for="item in allUsers" :value="item" :key="item">{{item}}</i-option>
        </i-select>
      </div>
      <div class="select-wrapper">
        <i-select v-model="queryParams.appname" placeholder="appname" clearable>
          <i-option v-for="item in allApps" :value="item" :key="item">{{item}}</i-option>
        </i-select>
      </div>
      <div class="select-wrapper">
        <i-select v-model="queryParams.type" placeholder="request or logger">
          <i-option v-for="item in allTypes" :value="item" :key="item">{{item}}</i-option>
        </i-select>
      </div>
      <div class="select-wrapper">
        <DatePicker v-model="queryParams.datetimeRange" type="datetimerange" format="yyyy-MM-dd HH:mm"
                    @on-ok="changeDatetimeRange"
                    placeholder="选择时间范围" style="width: 100%;"></DatePicker>
      </div>
      <div class="select-wrapper">
        <Button type="primary" @click="searchHistory">GO!</Button>
      </div>
    </div>
    <div class="indicator">
      <div class="left">
        <div class="filter">
          <i-input v-model="queryParams.keyword" placeholder="filter">
            <!-- TODO: 添加 regex -->
            <!-- <span slot="append"></span> -->
          </i-input>
        </div>
        <div class="request-list">
          <div class="request-title">
            <div class="caption">
              Name
            </div>
            <div class="options">
              <div class="option-item icon-sort" @click.stop="toggleSortDirection">
                  <Icon class="arrow-left" type="arrow-up-c"></Icon>
                  <Icon class="arrow-right" type="arrow-down-c"></Icon>
              </div>
            </div>
          </div>
          <div class="request-list">
            <div class="request-item" :class="{active: item === selectedRequest}"
                @click="selectRequest(item)"
                v-for="item in requestsToShow" :key="item.uuid">
              <div class="url-section" v-if="item.request">
                <div class="last">
                  {{ _splitUrl(_safeProp(item, 'request.url'))[1] }}
                </div>
                <div class="pre">
                  {{ _splitUrl(_safeProp(item, 'request.url'))[0] }}
                </div>
              </div>
              <div class="log-title" v-if="item.logger">
                {{ _safeProp(item, 'logger.title') }}
              </div>
              <div class="status-section">
                <Tooltip :content="item.createdAt | formatTime" placement="right">
                  <div v-if="item.request">
                    <Icon type="load-d" class="addon-icon"
                          v-show="!_safeProp(item, 'response.status')"
                          color="gray"></Icon>
                    <Icon type="happy-outline" class="addon-icon"
                          v-show="_isSuccessStatus(_safeProp(item, 'response.status'))"
                          :color="_statusColor(_safeProp(item, 'response.status'))"></Icon>
                    <Icon type="sad-outline" class="addon-icon"
                          v-show="_safeProp(item, 'response.status') && !_isSuccessStatus(_safeProp(item, 'response.status'))"
                          :color="_statusColor(_safeProp(item, 'response.status'))"></Icon>
                  </div>
                  <div v-if="item.logger">
                    <Icon type="android-list" class="addon-icon"
                          color="#2d8cf0"></Icon>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="labels">
          <CheckboxGroup v-model="queryParams.labels">
            <Checkbox :label="item" v-for="item in allLabels" :key="item">{{item}}</Checkbox>
          </CheckboxGroup>
        </div>
        <div class="detail">
          <Tabs :value="activeTabPane" :animated="false" @on-click="selectTabPane">
            <TabPane label="Headers" name="Headers" :disabled="!selectedRequest || isLogger">
              <div class="tab-pane general-pane">
                <Collapse :value="['1', '2', '3']">
                  <Panel name="1">
                    General
                    <div slot="content">
                      <div class="item">
                        <span class="title" v-show="requestUrl">Request URL: </span>{{requestUrl}}
                      </div>
                      <div class="item">
                        <span class="title" v-show="requestMethod">Request Method: </span>{{requestMethod}}
                      </div>
                      <div class="item">
                        <span class="title" v-show="responseStatus">Status Code: </span>
                        <Icon type="record" v-show="responseStatus" :color="responseStatusColor"></Icon>
                        {{responseStatus}}&nbsp;&nbsp;{{responseStatusText}}
                      </div>
                    </div>
                  </Panel>
                  <Panel name="2">
                    Response Headers
                    <div slot="content">
                      <div class="item" v-for="header in Object.entries(_safeProp(selectedRequest, 'response.headers', {}))" :key="header[0]">
                        <span class="title">{{header[0]}}: </span>{{header[1]}}
                      </div>
                    </div>
                  </Panel>
                  <Panel name="3">
                    Request Headers
                    <div slot="content">
                      <div class="item" v-for="header in Object.entries(_safeProp(selectedRequest, 'request.headers', {}))" :key="header[0]">
                        <span class="title">{{header[0]}}: </span>{{header[1]}}
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </TabPane>
            <TabPane label="Request" name="Request" :disabled="!selectedRequest || isLogger">
              <div class="tab-pane request-pane">
               <Collapse :value="['1', '2']">
                  <Panel name="1">
                    Params
                    <div slot="content" v-if="_isSomething(requestParams)">
                      <i-button class="opt" type="info" size="small"
                                @click="showInConsole(requestParams)">Console</i-button>
                      <!-- {{ requestParams }} -->
                      <br> <br> <hr>
                      <div class="preview">
                        <pre>{{ requestParams }}</pre>
                      </div>
                    </div>
                  </Panel>
                  <Panel name="2">
                    Query String parameters
                    <div slot="content" v-if="_isSomething(requestQueries)">
                      <i-button class="opt" type="info" size="small"
                                @click="showInConsole(requestQueries)">Console</i-button>
                      <br> <br> <hr>
                      <div class="preview">
                        <pre>{{ requestQueries }}</pre>
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </TabPane>
            <TabPane label="Response" name="Response" :disabled="!selectedRequest || isLogger">
              <div class="tab-pane response-pane">
               <Collapse :value="['1']">
                  <Panel name="1">
                    Data
                    <div slot="content" v-if="_isSomething(responseData)">
                      <i-button class="opt" type="info" size="small"
                                @click="showInConsole(responseData)">Console</i-button>
                      <br> <br> <hr>
                      <div class="preview">
                        <pre>{{ responseData }}</pre>
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </TabPane>
            <TabPane label="Logger" name="Logger" :disabled="!selectedRequest || !isLogger">
              <div class="tab-pane general-pane">
                <Collapse :value="['1']">
                  <Panel name="1">
                    Logger
                    <div slot="content" v-if="_isSomething(loggerData)">
                      <i-button class="opt" type="info" size="small"
                                @click="showInConsole(loggerData)">Console</i-button>
                      <br> <br> <hr>
                      <div class="preview">
                        <pre>{{ loggerData }}</pre>
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const R = require('ramda')
const qs = require('qs')
const axios = require('axios')
const moment = require('moment')
const { isNothing, isSomething, safeProp, statusText, statusColor, cleanReverse } = require('../utils')

let cache = { users: [], apps: [] }

export default {
  data () {
    return {
      queryParams: {
        username: '',
        appname: '',
        datetimeRange: [],
        keyword: '',
        labels: [],
        type: 'request'
      },
      activeTabPane: 'Headers',
      lastActivePane: 'Headers',
      currentSortDirection: true,
      allRequests: [],
      selectedRequest: null,
      allTypes: ['request', 'logger'],
      remoteOrigin: 'http://localhost:2333'
    }
  },
  computed: {
    allLabels() {
      const vm = this
      let labels = []
      labels = labels.concat(...this.allRequests.map(item => {
        if (vm.queryParams.username === '' || vm.queryParams.appname === '') {
          return []
        } else {
          if (item.username === vm.queryParams.username && item.appname === vm.queryParams.appname) {
            return item.labels || []
          } else {
            return []
          }
        }
      }))
      return [...new Set(labels)]
    },
    allUsers() {
      let users = []
      users = users.concat(this.allRequests.map(item => item.username))
      if (users.length === 0) {
        return cache.users || []
      } else {
        cache.users = [...new Set(users)]
        return cache.users
      }
    },
    allApps() {
      const vm = this
      let apps = []
      this.allRequests.forEach(item => {
        if (vm.queryParams.username && vm.queryParams.username === item.username) {
          apps.push(item.appname)
        }
      })
      if (apps.length === 0) {
        return cache.apps || []
      } else {
        cache.apps = [...new Set(apps)]
        return cache.apps
      }
    },
    filteredRequests() {
      let { username, appname, labels, keyword } = this.queryParams
      let requests = this.allRequests.filter(item => {
        if (!username || item.username !== username) return false
        if (!appname || item.appname !== appname) return false
        if (keyword !== '') {
          let loggerTitle = safeProp(item, 'logger.title')
          let requestUrl = safeProp(item, 'request.url')
          if (loggerTitle && !!~loggerTitle.indexOf(keyword)) {
            return true
          } else if (requestUrl && !!~requestUrl.indexOf(keyword)) {
            return true
          } else {
            return false
          }
        }
        for (let i = 0; i < labels.length; i++) {
          let mustContainLabel = labels[i]
          if (!~item.labels.indexOf(mustContainLabel)) return false
        }
        return true
      })
      return requests
    },
    requestUrl() {
      return safeProp(this.selectedRequest, 'request.url')
    },
    requestMethod() {
      return safeProp(this.selectedRequest, 'request.method')
    },
    requestQueries() {
      let url = safeProp(this.selectedRequest, 'request.url')
      let queries = url && url.split('?')[1]
      if (queries) {
        return qs.parse(queries)
      } else {
        return null
      }
    },
    requestParams() {
      let params = safeProp(this.selectedRequest, 'request.params')
      let __emit_uuid__ = safeProp(this.selectedRequest, 'request.params.__emit_uuid__')
      if (__emit_uuid__) {
        try {
          delete params.__emit_uuid__
        } catch (err) {}
      }
      return params
    },
    responseData() {
      return safeProp(this.selectedRequest, 'response.data')
    },
    responseStatus() {
      return safeProp(this.selectedRequest, 'response.status')
    },
    responseStatusText() {
      if (this.responseStatus) {
        return statusText(this.responseStatus)
      } else {
        return ''
      }
    },
    responseStatusColor() {
      return statusColor(this.responseStatus)
    },
    loggerData() {
      return safeProp(this.selectedRequest, 'logger.content')
    },
    requestsToShow() { // 考虑到排序，在不和 Array.push 冲突的前提下，需要创造一个全新的列表
      if (this.currentSortDirection) {
        return this.allRequests
      } else {
        return cleanReverse(this.allRequests)
      }
    },
    isLogger() {
      return !!safeProp(this.selectedRequest, 'logger')
    }

  },
  methods: {
    _splitUrl(url) {
      if (!url) {
        url = 'http://undefined'
      }
      let simplyfiedUrl = url.replace(/http:\/\/|https:\/\//, '')
      let urlParts = simplyfiedUrl.split('/')
      let pre, last

      // 用以区分对待 lisiur.com 和 lisiur.com?a=1 和 lisiur.com/posts?a=1
      if (urlParts.length === 1) {
        let queries = urlParts[0].split('?')[1]
        if (queries) {
          pre = urlParts[0].split('?')[0]
          last = '?' + queries
        } else {
          pre = urlParts[0]
          last = '/'
        }
      } else {
        last = urlParts.pop()
        pre = urlParts.join('/')
      }
      return [pre, last]
    },
    _isSomething: isSomething,
    _safeProp: safeProp,
    _statusColor: statusColor,
    _isSuccessStatus(status) {
      return (status && status >= 200 && status < 400)
    },
    selectRequest(item) {
      if (item.logger) { // Logger Type
        this.activeTabPane = 'Logger'
      } else {
        this.activeTabPane = this.lastActivePane
      }
      this.selectedRequest = item
    },
    selectTabPane(paneName) {
      if (paneName !== 'Logger') {
        this.activeTabPane = this.lastActivePane = paneName
      } else {
        this.activeTabPane = paneName
      }
    },
    showInConsole(data) {
      data = JSON.parse(JSON.stringify(data))
      window.$it = data
      console.log(data)
    },
    toggleSortDirection() {
      this.currentSortDirection = !this.currentSortDirection
    },
    searchHistory() {
      const vm = this
      const url = this.remoteOrigin + '/history'
      const queryParams = this.queryParams
      queryParams.startTime = new Date(this.queryParams.datetimeRange[0])
      queryParams.endTime = new Date(this.queryParams.datetimeRange[1])
      axios.post(url, queryParams)
        .then(requests => {
          vm.allRequests = requests.data
        })
    },
    changeDatetimeRange(timeRange) {
      this.searchHistory()
    }
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY/MM/DD HH:mm:ss')
    }
  },
  created() {
    const remoteOrigin = localStorage.getItem('remoteOrigin')
    this.remoteOrigin = remoteOrigin || this.remoteOrigin
    localStorage.setItem('remoteOrigin', this.remoteOrigin)
  },
  watch: {
    remoteOrigin(origin) {
      localStorage.setItem('remoteOrigin', origin)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 8px;
  .selectes {
    display: flex;
    .select-wrapper {
      margin-right: 16px;
      width: 250px;
    }
  }
  .indicator {
    display: flex;
    width: 100%;
    margin-top: 16px;
    .left {
      display: flex;
      width: 250px;
      flex-direction: column;
      .request-list {
        height: calc(~'100vh - 300px');
        margin-top: 4px;
        .request-title {
          height: 32px;
          display: flex;
          align-items: center;
          .caption {
            flex: 1;
            font-size: 14px;
          }
          .options {
            cursor: pointer;
            font-size: 18px;
            display: flex;
            .option-item {
              margin-left: 12px;
              &.icon-sort {
                color: #2d8cf0;
                .arrow-left {
                  position: relative;
                  left: 6px;
                }
              }
              &.icon-clear {
                color: #ed3f14;
              }
            }
          }
        }
        .request-list {
          height: calc(~'100vh - 140px');
          overflow: auto;
        }
        .request-item {
          display: flex;
          justify-content: center;
          padding: 4px 8px;
          height: 40px;
          cursor: pointer;
          &:nth-child(even) {
            background: #f8f8f9;
          }
          .url-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .pre {
              color: gray;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .last {
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .log-title {
            flex: 1;
            display: flex;
            align-items: center;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .status-section {
            display: flex;
            align-items: center;
            .addon-icon {
              font-size: 20px;
            }
          }
          &.active {
            background: #5cadff;
            color: white;
            .pre {
              color: white;
            }
            .addon-icon {
              color: white !important;
            }
          }
        }
      }
    }
    .right {
      margin-left: 16px;
      display: flex;
      width: calc(~'100% - 250px - 16px');
      flex-direction: column;
      .labels {
        height: 32px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        width: 100%;
        overflow: auto;
      }
      .detail {
        .tab-pane {
          display: flex;
          flex-direction: column;
          .preview {
            // max-height: calc(~"100vh - 265px");
          }
          hr {
            border: 0;
            height: 1px;
            background-color: #ddd;
          }
          .opt {
            margin-right: 8px;
          }
          .item {
            margin-bottom: 4px;
            word-wrap: break-word;
            .title {
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
<style>
.ivu-collapse {
  height: calc(100vh - 155px);
  overflow: auto;
}
</style>

