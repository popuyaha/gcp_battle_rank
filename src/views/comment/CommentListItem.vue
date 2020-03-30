<template>
  <div>
    <div class="flex flex-wrap justify-between">
      <div
        class="flex flex-col items-baseline content-center justify-center p-2 bg-blue-200"
      >
        <div class="text-sm">{{ commentObj.name }}</div>
        <div class="text-xs">{{ dateFmt(commentObj.created_at) }}</div>
      </div>
      <div class="flex flex-1 p-2 w-full" style="white-space:pre;">
        {{ commentObj.content }}
      </div>
      <!-- <div class="flex flex-col justify-center items-center p-2"> -->
      <div class="flex p-2 btn_box">
        <template v-if="commentObj.uid == user.user.uid">
          <el-button type="primary" class="btn_01" @click="updateComment"
            >수정</el-button
          >
          <el-button type="danger" class="btn_02" @click="deleteCommentConfirm"
            >삭제</el-button
          >
        </template>

        <el-button type="warning" class="btn_03" @click="subCommentToggle"
          >덧글 달기</el-button
        >
      </div>
    </div>
    <template v-if="subCommentCreateToggle">
      <CommentSubCreate
        :isSubComment="true"
        :commentId="commentObj.commentid"
        :content="commentObj"
        :noteId="noteId"
        :reloadSubComments="reloadSubComments"
        :subCommentToggle="subCommentToggle"
        :reloadSubSubComments="reloadSubSubComments"
      />
    </template>
    <template v-if="subCommentUpdateToggle">
      <CommentUpdate
        :isSubComment="true"
        :commentId="commentObj.commentid"
        :noteId="noteId"
        :content="commentObj"
        :reloadSubComments="reloadSubComments"
        :subUpdateCommentToggle="subUpdateCommentToggle"
      />
    </template>
    <template v-if="subCommentList.length > 0">
      <div
        class="flex flex-wrap justify-between border-b-2 border-gray-200 rounded-t-lg"
        :key="item.subcomment_id"
        v-for="(item, i) in subCommentList"
      >
        <div
          class="flex flex-col items-baseline text-xs pl-8 content-center justify-center p-2 bg-blue-200"
        >
          <div>{{ item.name }}</div>
          <div>{{ dateFmt(item.created_at) }}</div>
        </div>
        <div class="flex flex-1 p-2 w-full" style="white-space:pre;">
          {{ item.content }}
        </div>
        <template v-if="item.uid == user.user.uid">
          <div class="flex p-2 btn_box">
            <el-button type="primary" @click="updateSubComment(item, i)"
              >수정</el-button
            >
            <el-button type="danger" @click="deleteSubCommentConfirm(item)"
              >삭제</el-button
            >
          </div>
        </template>
      </div>
    </template>
    <template v-if="subsubCommentUpdateToggle2">
      <SubCommentUpdate
        :isSubComment="true"
        :commentId="subCommentList"
        :noteId="noteId"
        :content="subsubDatas"
        :replyData="commentObj"
        :reloadSubSubComments="reloadSubSubComments"
        :subsubCommentUpdateToggle="subsubCommentUpdateToggle"
      />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import firebase from '@/firebase'
import CommentUpdate from './CommentUpdate'
import CommentSubCreate from './CommentSubCreate'
import SubCommentUpdate from './SubCommentUpdate'

export default {
  name: 'CommentListItem',
  props: {
    commentObj: Object,
    reloadComment: Function,
    noteId: String
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  components: {
    CommentSubCreate,
    CommentUpdate,
    SubCommentUpdate
  },
  created() {
    this.rereplyList()
  },
  data() {
    return {
      content: '',
      modalParams: [],
      is_show: false,
      subCommentList: [],
      subsubDatas: [],
      subCommentCreateToggle: false,
      subCommentUpdateToggle: false,
      subsubCommentUpdateToggle2: false
    }
  },
  methods: {
    subCommentToggle() {
      this.subCommentCreateToggle = !this.subCommentCreateToggle
    },
    subUpdateCommentToggle() {
      this.subCommentUpdateToggle = !this.subCommentUpdateToggle
    },
    subsubCommentUpdateToggle() {
      this.subsubCommentUpdateToggle2 = !this.subsubCommentUpdateToggle2
    },
    reloadSubComments() {
      this.reloadComment()
    },
    reloadSubSubComments() {
      this.rereplyList()
    },
    updateComment() {
      this.subUpdateCommentToggle()
    },
    updateSubComment(data, index) {
      this.subsubDatas = this.subCommentList[index]
      this.subsubCommentUpdateToggle()
    },
    deleteCommentConfirm() {
      this.$confirm('정말 삭제하시겠습니까?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.deleteComment(this.commentObj)
          this.$message({
            type: 'success',
            message: '댓글 삭제 완료'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '댓글 삭제 취소'
          })
        })
    },
    deleteSubCommentConfirm(data) {
      this.$confirm('정말 삭제하시겠습니까?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.deleteSubComment(data)
          this.$message({
            type: 'success',
            message: '대댓글 삭제 완료'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '대댓글 삭제 취소'
          })
        })
    },
    dateFmt(date) {
      return moment(date).format('YYYY년 MM월 DD일')
    },
    async deleteComment(data) {
      let db = firebase.firestore()
      let collectionPath = 'GAME_BOARD_' + this.$route.params.id
      try {
        let list = []
        let id = ''
        //댓글 컬렉션 ID 조회
        list = await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .where('sort', '==', data.sort)
          .get()
        list.forEach(doc => {
          id = doc.id
        })
        let replyList = await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .doc(id)
          .collection('rereply')
          .get()
        //대댓글을 먼저 삭제 해줘야함
        replyList.forEach(async doc => {
          await db
            .collection(collectionPath)
            .doc(this.noteId)
            .collection('reply')
            .doc(id)
            .collection('rereply')
            .doc(doc.id)
            .delete()
        })
        //댓글 컬렉션 ID로 삭제
        await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .doc(id)
          .delete()
        this.reloadComment()
      } catch (error) {
        const text = '댓글 삭제 시 에러 발생'
        this.errorNotification(text, error)
      }
    },
    async deleteSubComment(data) {
      let db = firebase.firestore()
      let collectionPath = 'GAME_BOARD_' + this.$route.params.id
      try {
        let list = []
        let replyList = []
        let id = ''
        let deleteId = ''
        //댓글 컬렉션 ID 조회
        list = await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .where('sort', '==', this.commentObj.sort)
          .get()
        list.forEach(doc => {
          id = doc.id
        })
        //대댓글 컬렉션 ID 조회
        replyList = await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .doc(id)
          .collection('rereply')
          .where('sort', '==', data.sort)
          .get()
        replyList.forEach(doc => {
          deleteId = doc.id
        })
        //대댓글 컬렉션 ID로 삭제
        await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .doc(id)
          .collection('rereply')
          .doc(deleteId)
          .delete()
        this.reloadSubSubComments()
      } catch (e) {
        const text = '대댓글 삭제 시 에러 발생'
        this.errorNotification(text, e)
      }
    },
    async rereplyList() {
      try {
        this.subCommentList = []
        let db = firebase.firestore()
        let collectionPath = 'GAME_BOARD_' + this.$route.params.id
        let list = []
        let replyList = []
        let id = ''
        //댓글 ID 조회
        list = await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .where('sort', '==', this.commentObj.sort)
          .get()
        list.forEach(doc => {
          id = doc.id
        })
        //댓글 ID로 대댓글 리스트 조회
        replyList = await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .doc(id)
          .collection('rereply')
          .orderBy('sort', 'desc')
          .get()
        replyList.forEach(doc => {
          id = doc.id
          this.subCommentList.push(doc.data())
        })
      } catch (error) {
        // const text = '대댓글 목록 로드 시 에러 발생'
        // this.errorNotification(text, error)
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
    @apply m-1 py-1 px-2;
  }
}
</style>
