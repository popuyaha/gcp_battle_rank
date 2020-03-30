<template>
  <div class="h-full overflow-y-auto">
    <h2 class="m-4">
      랭크 요청 글 등록하기
    </h2>
    <el-input
      class="flex w-full my-2 "
      v-model="title"
      required
      placeholder="글 제목을 입력하세요"
    ></el-input>

    <div class="w-full h-64 text-left">
      <editor
        v-model="content"
        :options="editorOptions"
        :html="editorHtml"
        :visible="editorVisible"
        height="550px"
        mode="wysiwyg"
      />
      <div class="flex flex-wrap w-1/3 mt-2 ">
        <span>유저 명 :</span>
        <el-input placeholder="유저 명 입력" v-model="userId"></el-input>
      </div>
      <div class="w-full btn_box text-right">
        <el-button type="primary" @click="pointReq">
          등록
        </el-button>
        <el-button type="warning" @click="back">취소</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import router from '@/router'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { mapState } from 'vuex'
import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'
import { Editor } from '@toast-ui/vue-editor'
import dayjs from 'dayjs'

export default {
  components: {
    Editor
  },
  data() {
    const items = this.$route.params.item
    return {
      editorOptions: {
        hideModeSwitch: true,
        hooks: {
          addImageBlobHook: function(file, callback) {
            var storage = firebase.storage()
            // 스토리지 서비스에서 스토리지 참조 생성
            var storageRef = storage
              .ref()
              .child(
                `images/${this.user.user.uid}/${dayjs().format(
                  'YYYYMMDDHHmmss'
                )}.${file.name.split('.')[1]}`
              )
            storageRef
              .put(file)
              .then(sanpshot => {
                sanpshot.ref
                  .getDownloadURL()
                  .then(url => {
                    callback(url, file.name)
                  })
                  .catch(error => {
                    switch (error.code) {
                      // 파일이 존재하지 않는 경우
                      case 'storage/object-not-found':
                        break
                      // 사용자가 접근 허가를 못받은 경우
                      case 'storage/unauthorized':
                        break
                      // 사용자가 업로드를 취소한 경우
                      case 'storage/canceled':
                        break
                      // 알수없는 문제 발생, 서버 응답 관려
                      case 'storage/unknown':
                        break
                    }
                  })
              })
              .catch(error => {
                this.errorNotification(error.name, error.message)
                console.log('error', error)
              })
          }
        }
      },
      editorHtml: '',
      editorVisible: true,
      items,
      title: '',
      userId: '',
      content: ''
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  created() {},
  methods: {
    pointReq() {
      this.createBoard({
        title: this.title,
        content: this.content,
        userId: this.userId
      })
    },
    async back() {
      if (this.items) {
        try {
          let db = firebase.firestore()
          let data = []
          let id = ''
          let collectionPath =
            'GAME_BOARD_' + this.$route.params.id + '_REQUEST'
          //게시글 ID 조회
          data = await db
            .collection(collectionPath)
            .where('sort', '==', this.items.sort)
            .get()
          data.forEach(doc => {
            id = doc.id
          })
          this.$nextTick(function() {
            //게시글 ID로 게시글 화면으로 이동
            router.push(`readGameBoard?gameId=${id}`)
          })
        } catch (error) {
          const text = '게시판 글 목록 불러오기 시 에러 발생'
          this.errorNotification(text, error)
        }
      } else {
        router.push(`/game-board/${this.$route.params.id}`)
      }
    },
    async createBoard(board) {
      try {
        if (!board.title) {
          const text = '제목 미입력'
          const error = '제목이 없습니다.'
          this.errorNotification(text, error)
          return
        } else if (!board.content) {
          const text = '내용 미입력'
          const error = '내용이 없습니다.'
          this.errorNotification(text, error)
          return
        } else if (!board.userId) {
          const text = '등록 유저 명 미입력'
          const error = '등록 유저 명이 없습니다.'
          this.errorNotification(text, error)
          return
        }
        let db = firebase.firestore()
        let collectionPath = 'GAME_BOARD_' + this.$route.params.id + '_REQUEST'
        //게시글 생성
        db.collection(collectionPath).add({
          title: board.title,
          content: board.content,
          userId: board.userId,
          uid: this.user.user.uid,
          name: this.user.user.displayName,
          sort: firebase.firestore.FieldValue.serverTimestamp(),
          createDate: Date.now()
        })
        router.push(`/game-board/${this.$route.params.id}`)
      } catch (e) {
        const text = '게시판 글 생성 시 에러 발생'
        this.errorNotification(text, e)
      }
    },
    errorNotification(text, error) {
      this.$notify.error({
        title: text,
        message: error
      })
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
