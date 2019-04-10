<template>
<!--transition标签 按钮出现附带动画-->
  <transition name="el-fade-in">
    <!--<div class="page-component-up" @click="scrollToTop" v-show="toTopShow">
      <i class="el-icon-caret-top"></i>
      <span>返回顶部</span>
    </div>-->
    <div id="goTop" @click="scrollToTop" v-show="toTopShow">
		<img src="../../assets/img/goTop.png"  />
		<p>回到顶部</p>
	</div>
  </transition>
</template>

<script>
	export default {
    data() {
      return {
        toTopShow: false,
      }
    },
    methods: {
      handleScroll() {
        //首先修改相对滚动位置
        this.scrollTop = this.scrollTop = window.pageYOffset || document.body.scrollTop
        if (this.scrollTop > 300) {
          this.toTopShow = true
        }else {
          this.toTopShow = false
        }
      },
      scrollToTop() {
        let timer = null, _that = this
        //动画，使用requestAnimationFrame代替setInterval
        cancelAnimationFrame(timer)
        timer = requestAnimationFrame(function fn() {
          if (_that.scrollTop > 0) {
            _that.scrollTop -= 50
            //然后修改这里实现动画滚动效果
            document.body.scrollTop = document.documentElement.scrollTop = _that.scrollTop
            timer = requestAnimationFrame(fn)
          } else {
            cancelAnimationFrame(timer);
            _that.toTopShow = false
          }
        })
      }
    },
    mounted() {
      this.$nextTick(function () {
        //修改事件监听
        window.addEventListener('scroll', this.handleScroll)
        
      });
    },
    destroyed() {
      
      window.removeEventListener('scroll', this.handleScroll)
      
    }
  }
</script>

<style scoped lang="scss">
  /*.page-component-up{
    background-color: #409eff;
    position: fixed;
    right: 100px;
    bottom: 150px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    cursor: pointer;
    transition: .3s;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .5);
    z-index: 100;
    .el-icon-caret-top{
      color: #fff;
      display: block;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
    }
    p{
      display: none;
      text-align: center;
      color: #fff;
    }
    &:hover{
      opacity: .8;
    }
  }*/
 	#goTop{
		width: 100px;
		height: 120px;
		text-align: center;
		background: #ffffff;
		position: fixed;
		bottom: 30px;
		right: 40px;
		padding-top: 15px;
		box-shadow: 0 0 10px 1px #e5f1ff;
		border-radius: 5px;
		cursor: pointer;
	}
</style>