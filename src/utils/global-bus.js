/**
* 作为一个全局通信总线
* 作用：让任何组件之间进行相互通信
*/
import Vue from 'vue'
export default new Vue()
// 假设a要给b发送数据
// b注册通信事件 a发布通信事件
// 反过来
// 假设b要给a发送数据
// a注册通信事件 b发布通信事件

// 两组件都要加载该模块组件
// 注册事件语法：`globalBus.$emit('自定义事件名称'，() => {处理函数})`
// 注：通信的两段使用的事件名称必须保持一致，否则无法使用
