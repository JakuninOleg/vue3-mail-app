import { Server, Model, Factory } from "miragejs"
import faker from 'faker';

new Server({
  models: {
    email: Model
  },
  factories: {
    email: Factory.extend({
      subject(i) {
        return `Email ${i}`
      },
      body(){
        return faker.lorem.sentence()
      },
      sentDate(){
        return faker.date.recent(20)
      }
    })
  },
  seeds(server){
    server.createList('email', 10);
  },
  routes() {
    this.namespace = 'api';

    this.get('/emails');
  }
})