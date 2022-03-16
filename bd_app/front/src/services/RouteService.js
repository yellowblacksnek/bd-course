
class RouteService {
  groupStrings = {
    people:'Люди',
    employees:'Сотрудники',
    messages:'Сообщения',
    visas:'Визы',
    violations:'Нарушения',
  };

  allPages = [
    {name:'Все люди', group:'people', path:'/people', authorities:['decryption', 'analysis', 'strategy', 'operations', 'customs', 'diplomacy']},
    {name:'Все сотрудники', group:'employees', path:'/employees', authorities:['operations', 'diplomacy', 'analysis', 'strategy']},

    {name:'Все сообщения', group:'messages', path:'/messages', authorities:['strategy', 'analysis']},
    {name:'Сообщения для дешифровки', group:'messages', path:'/messages/decrypt', authorities:['decryption']},
    {name:'Сообщения для шифровки', group:'messages', path:'/messages/encrypt', authorities:['decryption']},
    {name:'Сообщения для обмена', group:'messages', path:'/messages/exchange', authorities:['interface']},

    {name:'Список виз', group:'visas', path:'/visas', authorities:['analysis', 'strategy', 'operations', 'customs', 'diplomacy']},
    {name:'Список заявок', group:'visas', path:'/visas/applications', authorities:['customs', 'analysis', 'strategy']},
    {name:'Список проверок заявок', group:'visas', path:'/visas/applications/checks_list', authorities:['customs', 'analysis', 'strategy']},
    {name:'Рассмотрение заявки', group:'visas', path:'/visas/applications/check', authorities:['customs']},
    {name:'Список нарушений', group:'visas', path:'/violations', authorities:['analysis', 'strategy', 'operations']},
    {name:'Список проверок нарушений', group:'visas', path:'/violations/checks_list', authorities:['analysis', 'strategy', 'operations']},
    {name:'Рассмотрение нарушения', group:'visas', path:'/violations/check', authorities:['operations']}
  ];

  getPages() {
    if(!localStorage.getItem("roles")) return [];
    const roles = JSON.parse(localStorage.getItem("roles")).map(i => i.authority);
    let pages = new Set();

    for(let page of this.allPages) {
      for(let auth of page.authorities) {
        if(roles.includes(auth)) {
          pages.add(page);
          break;
        }
      }
    }
    // console.log(Array.from(pages))
    return Array.from(pages);
  }

  hasAuthority(authority) {
    return JSON.parse(localStorage.getItem("roles"))
      .map(i => i.authority)
      .filter(i => i.endsWith(authority)).length > 0;
  }

  hasAccess(lvl) {
    const levels= {restricted: 0, standard: 1, high: 2, max: 3}
    const access = localStorage.getItem("access");
    return levels[access] >= levels[lvl];
  }
}

export default new RouteService();
