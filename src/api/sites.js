import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sites/login',
    method: 'post',
    data
  })
}
export function verifEmail(token) {
  return request({
    url: '/sites/verify-email?token=' + token,
    method: 'get'
  })
}
export function signup(info) {
  console.log(info)
  return request({
    url: '/sites/signup',
    method: 'post',
    data: { SignupForm: info }
  })
}

export function requestPasswordReset(data) {
  return request({
    url: '/sites/request-password-reset',
    method: 'post',
    data: { PasswordResetRequestForm: data }
  })
}
export function resendVerificationEmail(data) {
  return request({
    url: '/sites/resend-verification-email',
    method: 'post',
    data: { ResendVerificationEmailForm: data }
  })
}
export function resetPasswordToken(token) {
  return request({
    url: '/sites/password-reset-token?token=' + token,
    method: 'get'
  })
}
export function resetPassword(token, data) {
  return request({
    url: '/sites/reset-password?token=' + token,
    method: 'post',
    data: { ResetPasswordForm: data }
  })
}
export function bindedEmail(token) {
  return request({
    url: '/sites/binded-email?token=' + token,
    method: 'get'
  })
}
