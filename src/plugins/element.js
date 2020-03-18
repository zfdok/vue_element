import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Container, Header, Main, Aside, Menu, MenuItem, Submenu, Icon, MenuItemGroup,
  Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn,
  Switch, Tooltip
} from 'element-ui'

Vue.use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Container)
  .use(Header)
  .use(Main)
  .use(Aside)
  .use(Menu)
  .use(MenuItem)
  .use(Submenu)
  .use(Icon)
  .use(MenuItemGroup)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Card)
  .use(Row)
  .use(Col)
  .use(Table)
  .use(TableColumn)
  .use(Switch)
  .use(Tooltip)
Vue.prototype.$message = Message
