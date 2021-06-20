<template>
  <q-page class="realtive-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            class="new-qweet"
            bottom-slots
            v-model="newQweetContent"
            placeholder="What's Happening?"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar>
                <img
                  src="https://0.gravatar.com/avatar/3561c0b79496f6b3e0216e5b9e17d141?s=400&d=mm"
                />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            class="q-mb-lg"
            unelevated
            rounded
            color="primary"
            label="Qweet"
            no-caps
            :disable="!newQweetContent"
            @click="addNewQweet"
          />
        </div>
      </div>
      <q-separator size="10px" color="grey-2" class="divider"> </q-separator>
      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item
            clickable
            v-ripple
            v-for="qweet in qweets"
            :key="qweet.id"
            class="qweet q-py-md"
          >
            <q-item-section avatar top>
              <q-avatar>
                <img
                  src="https://0.gravatar.com/avatar/3561c0b79496f6b3e0216e5b9e17d141?s=400&d=mm"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label
                ><strong>Chetan Mahajan</strong>
                <span class="text-grey-7"
                  >@chetan_mahajan <br class="lt-md" />
                  &bull; {{ qweet.date | realativeDate }}</span
                ></q-item-label
              >
              <q-item-label class="qweet-content text-body1">
                {{ qweet.content }}
              </q-item-label>
              <div class="row justify-between q-mt-sm qweet-icons">
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="far fa-comment"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                />
                <q-btn
                  @click="toggleLiked(qweet)"
                  flat
                  round
                  :color="qweet.liked ? 'pink' : 'grey'"
                  size="sm"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-trash"
                  @click="deleteQweet(qweet)"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>
<style lang="sass">
.new-qweet
  textarea
    font-size: 10px
    line-height: 1.4
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -5px
.qweet:not(:first-child)
  border: 1px solid rgba(0,0,0,0.12)
</style>

<script>
import { formatDistance } from "date-fns";
import db from "src/boot/firebase";
export default {
  name: "PageHome",

  data() {
    return {
      newQweetContent: "",
      qweets: [
        // {
        //   id: "ID1",
        //   content:
        //     "-- I will be in your neighborhood doing errands this weekend. Do you want to grab brunch?",
        //   date: 1623940885302,
        //   liked: true,
        // },
        // {
        //   id: "ID2",
        //   content:
        //     "-- I will be in your neighborhood doing errands this weekend. Do you want to grab brunch?",
        //   date: 1623940915706,
        //   liked: false,
        // },
      ],
    };
  },
  methods: {
    addNewQweet() {
      console.log("add new  qweet");
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false,
      };
      // Add a new document in collection "cities"
      db.collection("qweets")
        .add(newQweet)
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
      this.newQweetContent = "";
    },
    deleteQweet(qweet) {
      db.collection("qweets")
        .doc(qweet.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
    toggleLiked(qweet) {
      // Set the "capital" field of the city 'DC'
      db.collection("qweets")
        .doc(qweet.id)
        .update({
          liked: !qweet.liked,
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
  },
  filters: {
    realativeDate(value) {
      return formatDistance(value, new Date());
    },
  },
  mounted() {
    db.collection("qweets")
      .orderBy("date")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let qweetChange = change.doc.data();
          qweetChange.id = change.doc.id;
          if (change.type === "added") {
            console.log("New Qweet: ", qweetChange);
            this.qweets.unshift(qweetChange);
          }
          if (change.type === "modified") {
            console.log("Modified Qweet: ", qweetChange);
            let index = this.qweets.findIndex(
              (qweet) => qweet.id === qweetChange.id
            );
            Object.assign(this.qweets[index], qweetChange);
          }
          if (change.type === "removed") {
            console.log("Removed Qweet: ", qweetChange);
            let index = this.qweets.findIndex(
              (qweet) => qweet.id === qweetChange.id
            );
            this.qweets.splice(index, 1);
          }
        });
      });
  },
};
</script>
