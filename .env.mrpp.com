# just a flag
ENV = 'mrpp.com'


# base api

VUE_APP_BASE_API = 'https://api.next.mrpp.com'
# base web
VUE_APP_BASE_URL = 'https://app.next.mrpp.com'

VUE_APP_BASE_MODE = 'mrpp.com'

VUE_APP_DOC_API = 'https://hololens2.cn/wp-json/wp/v2/'
