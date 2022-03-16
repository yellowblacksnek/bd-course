import ResourceService from "./ResourceService";


class MessagesService {
  getAllMessages(page,sort,search) {
    let res;
    if(!search)
      res = ResourceService.getResource('messages', 'messages',{page, sort, size: 20})
    else
      res = ResourceService.getResourceSearch('messages', search,{page, sort, size: 20})
    return res.then(res => {
      // const items = res.items.map(res => ({...res, exchange: res.msgExchanges.map(i => i.id).toString()}))
      for(let a in res.items) delete res.items[a].msgExchanges;
      return {items: res.items, page: res.page}
    })
  }

  getMessage(id) {
    return ResourceService.getResourceRaw('messages/'+id).then(res=>res.data)
  }

  postMessage(body) {
    return ResourceService.postResource('messages/create', body)
      .then(res => res.data);
  }

  updateMessage(id, body) {
    return ResourceService.updateResource(`messages/${id}`, body)
      .then(res => {
        if(res.status !== 201) {
          console.log('updateMessage', res);
        }
      })
  }

  // getMessagesByEmployee(page) {
  //   return ResourceService.getResource( 'messages/search/findByDecEmpl','messages',
  //     {page: page, size: 20, employee: localStorage.getItem("employee")}
  //   ).then( res => {
  //       const items = res.items
  //         .filter(e => e.msgState === 'decrypting')
  //         .map(e => ({id: e.id, encContent: e.encContent}));
  //       console.log(res)
  //       return {items, page: res.page};
  //     }
  // )};
  //
  // getMessagesByState(page, state) {
  //   return ResourceService.getResource('messages/search/findByMsgState', 'messages',
  //     {state}
  //   ).then(res => {
  //       console.log('loaded received messages');
  //       const items = res.items
  //         .map(e => ({id: e.id, encContent: e.encContent}));
  //       return {items, page: res.page};
  //     }
  //   );
  // }

  getMessagesSearch(page, sort, search) {
    return ResourceService.getResource('messages', 'messages',
      {page,sort,search})
    //   .then(res => {
    //     console.log('loaded received messages');
    //     const items = res.items
    //       .map(e => ({id: e.id, encContent: e.encContent}));
    //     return {items, page: res.page};
    //   }
    // );
  }

  submitDecrypted(id, data) {
    const body = {
      sender: data.sender,
      recipient: data.recipient,
      content: data.content,
      msgState: 'decrypted'
    }
    return this.updateMessage(id, body);
  }

  submitDecrypting(id) {
    return this.updateMessage(id, {decEmpl: localStorage.getItem("employee"), msgState: 'decrypting'});
  }
}

export default new MessagesService();