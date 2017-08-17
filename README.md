# vue-switch-display
vue 切换 element-ui el-table 中 input 和其他元素显示的指令

### Demo

例子使用 element-ui 的 el-table, el-table-column 组件.

注意：el-table 如果启用 fixed 模式，则该指令无效。因为这种情况下，el-table-column 会生成多份，且一部展示一部分不展示，正在适配中。

```html
demo.vue

<el-table v-parent2="hiddenOccultationCallback"
:data="tableData"
style="width: 100%">
<el-table-column prop="date"
  label="日期"
  width="180">
  <template scope="scope">
    <p v-chilrd:display="{scope: scope, order: 0}">{{scope.row.date}}</p>
    <el-input v-chilrd:occultation="{scope: scope, order: 0}"
      v-model="scope.row.date"
      placeholder=""></el-input>
  </template>
</el-table-column>
<el-table-column prop="name"
  label="姓名"
  width="180">
  <template scope="scope">
    <p v-chilrd:display.last="{scope: scope, order: 1}">{{scope.row.name}}</p>
    <el-input v-chilrd:occultation.last="{scope: scope, order: 1}"
      v-model="scope.row.name"
      placeholder=""></el-input>
  </template>
</el-table-column>
```
