<template>
	<div class="star" :class="starType">
    	<span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>
	
<script>
	// 评分有几个等级
  const LENGTH = 5;
  // 全星有几个
  const CLS_ON = 'on';
  // 半星有几个
  const CLS_HALF = 'half';
  // 不亮的星星有几个
  const CLS_OFF = 'off';
  export default {
    props: {
      // 图片尺寸
      size: {
        type: Number
      },
      // 评分
      score: {
        type: String
      }
    },
    computed: {
      // 显示对应尺寸的星星图片, 比如size是48,则添加star-48类,显示对应样式
      starType() {
        return 'star-' + this.size;
      },
      // 包含
      itemClasses() {
        let result = [];
        // 分数取整
        let score = Math.floor(this.score * 2) / 2;
        // 判断是否有半星
        let hasDecimal = score % 1 !== 0;
        // 计算有几个全星
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  };

</script>

<style lang="stylus" rel="stylus/stylesheet">
@import "../../assets/stylus/mixin.styl";
  .star
    font-size 0
    .star-item
      display inline-block
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('star48_on',20px,20px,no-repeat)
        &.half
          bg-image('star48_half',20px,20px,no-repeat)
        &.off
          bg-image('star48_off',20px,20px,no-repeat)
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        &:last-child
          margin-right 0
        &.on
          bg-image('star48_on',15px,15px,no-repeat)
        &.half
          bg-image('star48_half',15px,15px,no-repeat)
        &.off
          bg-image('star48_off',15px,15px,no-repeat)
    
</style>