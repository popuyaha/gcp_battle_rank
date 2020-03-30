<template>
  <div class="h-full overflow-y-auto">
    <div class="flex border-b-4 border-solid border-gray-300 w-full">
      <div class="w-3/4 text-2xl text-left">
        {{ items.title }}
      </div>
      <div class="w-1/4 text-right">
        <div class="text-sm">글쓴이: {{ items.name }}</div>
        <div class="text-sm">등록일: {{ dateFmt(items.created_at) }}</div>
        <div class="text-sm">요청대상: {{ items.userId }}</div>
      </div>
    </div>
    <div class="w-full text-left">
      <viewer
        v-model="items.content"
        :options="editorOptions"
        :html="editorHtml"
        :visible="editorVisible"
        mode="wysiwyg"
      />
    </div>
    <div
      class="w-full btn_box border-b-4 border-solid border-gray-300 text-right"
    >
      <!-- <template v-if="items.uid == user.user.uid"> -->
      <el-button type="danger" class="btn" @click="deleteDataConfirm"
        >삭제</el-button
      >
      <!-- </template> -->
      <el-button type="warning" class="btn" @click="back">돌아가기</el-button>
    </div>

    <template v-if="items.updateYn">
      <div class="py-5 item-center">
        이미 포인트가 적용된 글입니다.
      </div>
    </template>
    <template v-else>
      <template>
        <div class="flex py-5 px-2 items-center">
          <el-radio v-model="createUserYn" @change="changeUser" label="N"
            >기존 사용자 포인트 변경</el-radio
          >
          <el-radio v-model="createUserYn" @change="changeUser" label="Y"
            >신규 사용자 포인트 입력</el-radio
          >
        </div>
      </template>
      <template v-if="!createUserFlag">
        <div class="flex flex-col my-2">
          <el-form class="flex w-full" ref="form">
            <div class="px-2">
              <p>{{ '유저를 선택하세요' }}</p>
              <el-select
                v-model="value"
                filterable
                autocomplete
                default-first-option
                placeholder="유저 선택"
              >
                <el-option
                  v-for="item in rankUserList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </div>
            <div class="px-2">
              <p>{{ '보유 포인트' }}</p>
              <el-input
                class="flex w-full"
                v-model="rankPoint"
                :disabled="true"
              />
            </div>
            <div class="px-2">
              <p>{{ '포인트 입력' }}</p>
              <el-select
                class="flex w-full"
                v-model="updateRankPoint"
                placeholder="점수를 선택하세요"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="btn_box content-center">
              <el-button type="primary" @click="updateUser()"
                >작성하기</el-button
              >
            </div>
          </el-form>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col my-2">
          <el-form class="flex w-full" ref="form">
            <label>
              {{ '등록할 유저를 선택하세요' }}
              <el-input
                class="flex w-full"
                placeholder="유저 등록"
                v-model="rankUserName"
              />
            </label>
            <label>
              {{ '포인트 입력' }}
              <el-select
                class="flex w-full"
                v-model="createRankPoint"
                placeholder="점수를 선택하세요"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </label>
            <el-button type="primary" @click="createUser()">작성하기</el-button>
          </el-form>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import router from '@/router'
import firebase from '@/firebase'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import 'tui-editor/dist/tui-editor-contents.css'
import 'highlight.js/styles/github.css'
import { Viewer } from '@toast-ui/vue-editor'
Vue.use(VueMomentJS, moment)
export default {
  components: {
    viewer: Viewer
  },
  data() {
    const item = this.$route.query.gameId
    return {
      editorOptions: {
        hideModeSwitch: true
      },
      editorHtml: '',
      editorVisible: true,
      item: item,
      items: [],
      rankUserName: '',
      rankUserKey: '',
      rankPoint: 0,
      updateRankPoint: '',
      createRankPoint: '',
      rankUserList: [],
      createUserFlag: false,

      createUserYn: 'N',
      options: [
        {
          value: '10',
          label: '일반 대전 승리: 10점'
        },
        {
          value: '30',
          label: '대회 준우승: 30점'
        },
        {
          value: '50',
          label: '대회 우승: 50점'
        }
      ],
      value: []
    }
  },
  watch: {
    value: function(newVal) {
      this.rankUserList.filter(data => {
        if (data.name === newVal) {
          this.rankPoint = data.point
          this.rankUserKey = data.sort
        }
      })
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  async mounted() {
    let db = firebase.firestore()
    try {
      let data = []
      let collectionPath = `GAME_BOARD_${this.$route.params.id}_REQUEST`
      //게시글 ID로 게시글 데이터 조회
      data = await db
        .collection(collectionPath)
        .doc(this.item)
        .get()
      this.items = data.data()
    } catch (error) {
      this.errorNotification(error)
    }
    try {
      let data = []
      let collectionPath = `GAME_BOARD_${this.$route.params.id}_RANK`
      //게시글 ID로 게시글 데이터 조회
      data = await db.collection(collectionPath).get()
      let rankData = []
      data.forEach(doc => {
        rankData.push(doc.data())
      })
      this.rankUserList = rankData
    } catch (error) {
      this.errorNotification(error)
    }
  },

  methods: {
    back() {
      router.replace(`pointRequestList`)
    },
    async deleteDataConfirm() {
      this.$confirm('정말 삭제하시겠습니까?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.deleteData()
          this.$message({
            type: 'success',
            message: '게시글 삭제 완료'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '게시글 삭제 취소'
          })
        })
    },
    dateFmt(date) {
      return moment(date).format('YYYY년 MM월 DD일')
    },
    async deleteData() {
      try {
        let db = firebase.firestore()
        let collectionPath = 'GAME_BOARD_' + this.$route.params.id
        let data
        let id = ''
        //게시글 ID 조회
        data = await db
          .collection(collectionPath)
          .where('sort', '==', this.items.sort)
          .get()
        data.forEach(doc => {
          id = doc.id
        })
        //게시글 ID로 게시글 삭제
        await db
          .collection(collectionPath)
          .doc(id)
          .delete()
        router.replace(`/game-board/${this.$route.params.id}`)
      } catch (e) {
        this.errorNotification(e)
      }
    },
    errorNotification(text, error) {
      this.$notify.error({
        title: text,
        message: error
      })
    },
    async updateUser() {
      if (!this.rankUserKey) {
        const text = '유저를 선택해 주세요'
        const error = '유저 미선택'
        this.errorNotification(error, text)
        return
      }
      if (!this.updateRankPoint) {
        const text = '점수를 선택해 주세요'
        const error = '점수 미선택'
        this.errorNotification(error, text)
        return
      }
      let point = parseInt(this.rankPoint) + parseInt(this.updateRankPoint)
      try {
        let db = firebase.firestore()
        let collectionPath = `GAME_BOARD_${this.$route.params.id}_RANK`
        let data
        let id = ''
        //랭크 리스트 ID 조회
        data = await db
          .collection(collectionPath)
          .where('sort', '==', this.rankUserKey)
          .get()
        data.forEach(doc => {
          id = doc.id
        })
        //랭크 리스트 ID로 랭크 포인트 수정
        await db
          .collection(collectionPath)
          .doc(id)
          .update({
            point: point,
            updateDate: Date.now()
          })
        this.updateFlag()
        router.replace(`pointRequestList`)
      } catch (e) {
        const text = '랭크 유저 포인트 수정 시 에러 발생'
        this.errorNotification(text, e)
      }
    },
    async createUser() {
      if (!this.rankUserName) {
        const text = '신규 유저를 입력해 주세요'
        const error = '유저 미입력'
        this.errorNotification(error, text)
        return
      }
      if (!this.createRankPoint) {
        const text = '점수를 선택해 주세요'
        const error = '점수 미선택'
        this.errorNotification(error, text)
        return
      }
      try {
        let db = firebase.firestore()
        let collectionPath = `GAME_BOARD_${this.$route.params.id}_RANK`
        //신규 랭크 유저 생성
        await db.collection(collectionPath).add({
          name: this.rankUserName,
          point: parseInt(this.updateRankPoint),
          sort: firebase.firestore.FieldValue.serverTimestamp(),
          createDate: Date.now()
        })
        this.updateFlag()
        router.replace(`pointRequestList`)
      } catch (e) {
        const text = '랭크 유저 등록 시 에러 발생'
        this.errorNotification(text, e)
      }
    },
    async updateFlag() {
      let db = firebase.firestore()
      try {
        let data = []
        let id = ''
        let collectionPath = `GAME_BOARD_${this.$route.params.id}_REQUEST`
        //랭크요청 글 데이터 조회
        data = await db
          .collection(collectionPath)
          .doc(this.item)
          .get()
        id = data.id
        //랭크 요청 글 updateYn값 변경
        await db
          .collection(collectionPath)
          .doc(id)
          .update({
            updateYn: !this.items.updateYn,
            updateAt: Date.now()
          })
        this.items = data.data()
      } catch (error) {
        this.errorNotification(error)
      }
    },
    changeUser() {
      this.createUserFlag = !this.createUserFlag
    }
  }
}
</script>
<style scoped lang="less">
.btn_box {
  .el-button {
    @apply m-1 py-2 px-2;
  }
}
</style>
