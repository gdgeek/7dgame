<template>
  <!-- 联系我们板块 -->
  <section>
    <div align="center">
      <div class="background-box-image3">
        <div class="section-title" align="center">
          <h1 class="p-title-m">联系我们</h1>
          <h4>更高效，更专业</h4>
          <!-- 动态绑定underline class -->
          <p
            :class="[
              isBlue ? 'section-underline-blue' : 'section-underline-style'
            ]"
          />
          <br />
          <div align="center">
            <p>
              <img
                src="/media/bg/phone-icon.png"
                align="absmiddle"
                alt=""
                height="26px"
              />
              服务电话
              <a ref="telPhone" href="tel:15000159790">15000159790</a>
            </p>
            <p>
              <img
                src="/media/bg/wechat-icon.png"
                align="absmiddle"
                alt=""
                height="26px"
              />
              服务微信 15000159790
            </p>
          </div>
          <br />
          <h4 style="padding: 0 50px">
            上海市松江区广富林路697弄嘉鸿大厦1211室,上海游七网络科技有限公司
          </h4>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import '@/assets/font/font.css'
export default {
  name: 'Relation',
  props: {
    isBlue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
@import '~@/styles/sandtable.scss';
.background-box-image3 {
  padding: 60px 20px;
  width: 100%;
  height: 450px;
  background: url('/media/bg/2328.jpg') center no-repeat;
  background-size: cover;
}
</style>
