# just a flag
ENV = 'staging'


# base api
VUE_APP_BASE_API = 'https://api.4mr.cn'
# base web
VUE_APP_BASE_URL = 'https://4mr.cn'

VUE_APP_BASE_MODE = '4mr.com'
VUE_APP_DOC_API = 'https://hololens2.cn/wp-json/wp/v234/'
