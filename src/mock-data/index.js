module.exports = [
  {
    uuid: '1',
    username: 'lisiur',
    appname: 'appname',
    labels: ['GET', 'INDEX'],
    createdAt: new Date(),
    request: {
      method: 'GET',
      url: 'http://lisiur.com?a=1&a=2&b=1',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        id: 1,
      },
    },
    response: {
      status: 200,
      message: '',
      headers: [],
      data: {
        code: '1',
        datas: [{
          name: 'lisiur',
          test: [{
            test: [{
              test: 'test'
            }]
          }]
        }]
      }
    },
  },
  {
    uuid: '4',
    username: 'lisiur',
    appname: 'appname',
    labels: ['GET', 'INDEX'],
    createdAt: new Date(),
    request: {
      method: 'GET',
      url: 'http://lisiur.com/test?a=1&a=2&b=1',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        id: 1,
        __emit_uuid__: 'test_emit_uuid'
      },
    },
    response: {
      status: 200,
      message: '',
      headers: [],
      data: {
        code: '1',
        datas: [{
          name: 'lisiur',
          test: [{
            test: [{
              test: 'test'
            }]
          }]
        }]
      }
    },
  },
  {
    uuid: '2',
    username: 'lisiur',
    appname: 'appname',
    labels: ['log'],
    createdAt: new Date(),
    logger: {
      title: 'log title',
      content: {
        content: {
          content: {
            content: {
              content: 'content'
            }
          }
        }
      }
    }
  },
  {
    uuid: '3',
    username: 'lisiur',
    appname: 'appname',
    labels: ['log'],
    createdAt: new Date(),
    logger: {
      title: 'log title',
      content: 0
    }
  }
]
