<template>
  <BulkActionBar :emails="emails" />
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in unarchivedEMails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
      >
        <td>
          <input
            type="checkbox"
            @click="emailSelection.toggle(email)"
            :checked="emailSelection.emails.has(email)"
          />
        </td>
        <td @click="openEmail(email)">{{ email.from }}</td>
        <td @click="openEmail(email)">
          <p>
            <strong>{{email.subject}}</strong>
            - {{email.body}}
          </p>
        </td>
        <td class="date" @click="openEmail(email)">{{format(new Date(email.sentAt), 'do MMM yy')}}</td>
        <td>
          <button @click="archiveEmail(email)">Archive</button>
        </td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" @changeEmail="changeEmail"></MailView>
  </ModalView>
</template>

<script>
import { format } from "date-fns";
import { ref } from 'vue';
import useEMailSelection from "@/composables/use-email-selection";
import axios from "axios";
import MailView from "@/components/MailView.vue";
import ModalView from "@/components/ModalView.vue";
import BulkActionBar from "@/components/BulkActionBar.vue";

export default {
  async setup() {
    let { data: emails } = await axios.get("http://localhost:3000/emails");

    return {
      format,
      emails: ref(emails),
      openedEmail: ref(null),
      emailSelection: useEMailSelection()
    };
  },
  components: {
    MailView,
    ModalView,
    BulkActionBar
  },
  computed: {
    sortedEMails() {
      return this.emails.sort((a, b) => {
        return a.sentAt < b.sentAt ? 1 : -1;
      });
    },
    unarchivedEMails() {
      return this.sortedEMails.filter(e => !e.archived);
    }
  },
  methods: {
    openEmail(email) {
      if (email) {
        email.read = true;
        this.updateEmail(email);
      }
      this.openedEmail = email;
    },
    archiveEmail(email) {
      email.archived = true;
      this.updateEmail(email);
    },
    changeEmail({ toggleRead, toggleArchive, save, closeModal, changeIndex }) {
      let email = this.openedEmail;

      if (toggleRead) email.read = !email.read;
      if (toggleArchive) email.archived = !email.archived;
      if (save) this.updateEmail(email);
      if (closeModal) this.openedEmail = null;

      if (changeIndex) {
        let emails = this.unarchivedEMails;
        let currentIndex = emails.indexOf(this.openedEmail);
        let newEmail = emails[currentIndex + changeIndex];
        this.openEmail(newEmail);
      }
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    }
  }
};
</script>
