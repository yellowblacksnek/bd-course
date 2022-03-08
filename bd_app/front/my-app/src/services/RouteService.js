
class RouteService {
  groupStrings = {
    people:'Люди',
    employees:'Сотрудники',
    messages:'Сообщения',
    visas:'Визы',
    violations:'Нарушения',
  };

  allPages = [
    {name:'Все люди', group:'people', path:'/people'},
    {name:'Все сотрудники', group:'employees', path:'/employees'},

    {name:'Все сообщения', group:'messages', path:'/messages'},
    {name:'Сообщения для дешифровки', group:'messages', path:'/messages/decrypt'},
    {name:'Сообщения для шифровки', group:'messages', path:'/messages/encrypt'},
    {name:'Сообщения для обмена', group:'messages', path:'/messages/exchange'},

    {name:'Список виз', group:'visas', path:'/visas'},
    {name:'Список заявок', group:'visas', path:'/visas/applications'},
    {name:'Рассмотрение зявки', group:'visas', path:'/visas/applications/check'},
    {name:'Список нарушений', group:'visas', path:'/violations'},
    {name:'Рассмотрение нарушения', group:'visas', path:'/violations/check'}
  ];
}

export default new RouteService();
