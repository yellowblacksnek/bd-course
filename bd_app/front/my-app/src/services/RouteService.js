
class RouteService {
  groupStrings = {
    people:'Люди',
    employees:'Сотрудники',
    messages:'Сообщения',
    visas:'Визы',
    violations:'Нарушения',
  };

  allPages = [
    {name:'Хуисок людей', group:'people', path:'/people'},
    {name:'Все люди', group:'people', path:'/people'},
    {name:'Все сотрудники', group:'employees', path:'/employees'},

    {name:'Все сообщения', group:'messages', path:'/messages'},
    {name:'Сообщения для дешифровки', group:'messages', path:'/messages/decrypt'},
    {name:'Сообщения для шифровки', group:'messages', path:'/messages/encrypt'},
    {name:'Сообщения для обмена', group:'messages', path:'/messages/exchange'},

    {name:'Список виз', group:'visas', path:'/visas'},
    {name:'Список заявок', group:'visas', path:'/visas/applications'}
  ];
}

export default new RouteService();
