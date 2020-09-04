import { reactive } from 'vue';
import axios from 'axios';

let emails = reactive(new Set())

const useEmailSelection = function () {
  let toggle = (email) => {
    if (emails.has(email)) {
      emails.delete(email)
    } else {
      emails.add(email)
    }
  }

  let clear = () => {
    emails.clear()
  }

  let addMultiple = (newEmails) => {
    newEmails.forEach(email => {
      emails.add(email)
    });
  }

  let forSelected = (fn) => {
    emails.forEach(email => {
      fn(email);
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    })
  }

  let markRead = () => forSelected(email => email.read = true);
  let markUnread = () => forSelected(email => email.read = false);
  let archive = () => { forSelected(email => email.archive = true); clear() }

  return {
    emails,
    toggle,
    clear,
    addMultiple,
    markRead,
    markUnread,
    archive
  }
}

export default useEmailSelection;
