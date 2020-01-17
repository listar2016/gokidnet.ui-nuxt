<template>
  <div class="row">
    <div class="col s5 offset-s1">
      <div class="card">
        <div class="card-content">
          <div class="row">
            <div class="col s5">
              <div class="m-t-3">
                <vue-select
                  v-model="message.type"
                  :reduce="item => item.code"
                  label="name"
                  :options="types"
                  :placeholder="$t('messaging.messageType')"
                  style="margin-top: 21px"
                />
              </div>
            </div>
            <div class="col s5">
              <div class="m-t-3">
                <Select
                  :value="message"
                  :options="recipients"
                  prop-name="recipients"
                  :name="$t('messaging.recipients')"
                  style="margin-top: 21px"
                  multiple
                  :reduce="item => item"
                />
              </div>
            </div>
            <div class="col s2">
              <div class="m-t-3">
                <v-checkbox v-model="message.instant" :label="$t('messaging.instant')" />
              </div>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col s12">
              <div class="m-t-3">
                <Input :value="message" prop-name="title" error.sync="error" :name="$t('messaging.messageTitle')" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <div class="m-t-3">
                <ClientOnly>
                  <quill-editor
                    v-model="message.body"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                  ></quill-editor>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col s5">
      <!-- <transition-group name="fade"> -->
      <SelectRecipients
        type="Students"
        v-if="message.recipients.includes('Students')"
        :items="students"
        @add-recipient="addRecipient"
        :selectedItems="message.recipient_students"
        key="Students"
      />
      <SelectRecipients
        type="Staffs"
        v-if="message.recipients.includes('Staffs')"
        :items="staffs"
        @add-recipient="addRecipient"
        :selectedItems="message.recipient_staffs"
        key="Staffs"
      />
      <!-- </transition-group> -->
    </div>
    <div class="col s10 offset-s1">
      <div class="card">
        <div class="card-content">
          <div class="row">
            <div class="col s12">
              <a class="waves-effect waves-light btn indigo right" @click="save">{{ $t('send') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Input from "~/components/ui/input";
import Select from "~/components/ui/select";
import SelectRecipients from "~/components/messaging/select-recipients";
import ClientOnly from 'vue-client-only'

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  components: {
    ClientOnly,
    Input,
    Select,
    SelectRecipients
  },
  methods: {
    addRecipient(t, item) {
      let type = t == "Students" ? "recipient_students" : "recipient_staffs";
      let foundIndex = this.message[type].findIndex(el => {
        return el == item.id;
      });

      if (foundIndex == -1) {
        this.message[type].push(item.id);
      } else {
        console.info("Index founded " + foundIndex);
        this.message[type].splice(foundIndex, 1);
      }
      return 0;
    },
    save() {
      this.$http.post("/message_messages/", this.message).then(data => {
        if (data.status == 201) {
          this.$router.push("/messaging");
        }
      });
    },
    onEditorBlur(quill) {},
    onEditorFocus(quill) {},
    onEditorReady(quill) {},
    onEditorChange({ quill, html, text }) {
      this.message.body = html;
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    this.$http.get("/staff_staffs/?pagesize=100000").then(response => {
      this.staffs = response.data.results;
    });
    this.$http.get("/message_messages/types/").then(response => {
      this.types = response.data.choices;
    });
    this.$http.get("/student_students/?pagesize=100000").then(response => {
      this.students = response.data.results;
    });
  },
  data() {
    return {
      staffs: [],
      students: [],
      types: [],
      recipients: ["Students", "Staffs"],
      editorOption: {
        // some quill options
      },
      message: {
        type: "",
        title: "",
        body: "",
        instant: true,
        recipient_students: [],
        recipient_staffs: [],
        recipients: "Students"
      }
    };
  }
};
</script>
