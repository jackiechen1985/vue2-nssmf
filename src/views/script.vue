<template>
  <div>
    <div class="mwin">
      <div class="titlebar">
        <h2 class="title">
          <i class="el-icon-c-scale-to-original"></i>
          脚本包管理
        </h2>
        <div class="btnbar">
          <el-button
            size="small"
            type="info"
            plain
            icon="el-icon-upload2"
            @click="uploadDialogVisible = true"
          >导入</el-button>
        </div>
      </div>
      <div class="mainbody">
        <el-table
          :data="scriptList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
          style="width: 100%;"
        >
          <el-table-column label="脚本包名称" prop="scriptName"></el-table-column>
          <el-table-column label="URI" prop="scriptUri"></el-table-column>
          <el-table-column label="脚本包描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-delete"
                @click="deleteScript(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentPageChange"
            :current-page.sync="currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="scriptList.length"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-alert
      class="alert"
      v-if="showSuccess"
      :title="successTitle"
      type="success"
      :description="successData"
      @close="closeSuccessAlert"
      show-icon
    ></el-alert>
    <el-alert
      class="alert"
      v-if="showError"
      :title="errorTitle"
      type="error"
      :description="errorData"
      @close="closeErrorAlert"
      show-icon
    ></el-alert>
    <el-dialog
      title="删除脚本包"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <el-row>
        确认删除
        <span style="color: #409EFF; font-weight: bold;">{{currentScript}}</span>脚本包？
      </el-row>
      <span slot="footer">
        <el-button size="small" @click="deleteDialogVisible = false">取 消</el-button>
        <el-button size="small" style="margin-left: 10px;" type="primary" @click="comfirmDelete">确 认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入脚本包"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="uploadDialogVisible"
      width="30%"
    >
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="本地上传" name="localUpload"></el-tab-pane>
        <el-tab-pane label="远程服务器上传" name="remoteUpload"></el-tab-pane>
      </el-tabs>
      <el-col>
        <div>脚本包名称</div>
        <el-input size="mini" v-model="scriptName"></el-input>
      </el-col>
      <el-col>
        <div>脚本包描述</div>
        <el-input size="mini" v-model="description"></el-input>
      </el-col>
      <el-col style="margin-top: 10px; margin-bottom: 5px;" v-if="activeTab == 'localUpload'">
        <el-upload
          class="upload-demo"
          ref="upload"
          accept=".zip"
          :http-request="httpRequest"
          action="11"
          :limit="1"
          :on-success="onFileSuccess"
          :on-error="onFileError"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button size="small" slot="trigger" type="primary">选取文件</el-button>
        </el-upload>
      </el-col>
      <el-col style="margin-top: 10px; margin-bottom: 10px;" v-if="activeTab == 'remoteUpload'">
        <div>服务器地址</div>
        <div>
          <el-input size="mini" placeholder="请输入地址" v-model="remoteAddress">
            <template slot="prepend">Http://</template>
          </el-input>
        </div>
      </el-col>
      <span slot="footer">
        <el-button size="small" @click="uploadDialogVisible = false">取 消</el-button>
        <el-button
          v-if="activeTab == 'localUpload'"
          :disabled="scriptName.length <= 0"
          size="small"
          style="margin-left: 10px;"
          type="success"
          icon="el-icon-upload"
          @click="submitLocalUpload"
        >上载脚本包</el-button>
        <el-button
          v-if="activeTab == 'remoteUpload'"
          :disabled="scriptName.length <= 0 || remoteAddress.length <= 0"
          size="small"
          style="margin-left: 10px;"
          type="success"
          icon="el-icon-upload"
          @click="submitRemoteUpload"
        >上载脚本包</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapMutations } from 'vuex'
import API from '@/data/api.js'
import N from '@/data/notification.js'

export default {
  data () {
    return {
      // pagination
      currentPage: 1,
      pageSize: 10,
      uploadDialogVisible: false,
      deleteDialogVisible: false,
      currentScript: '',
      showSuccess: false,
      successTitle: '',
      successData: '',
      showError: false,
      errorTitle: '',
      errorData: '',
      activeTab: 'localUpload',
      scriptName: '',
      description: '',
      fileList: [],
      remoteAddress: ''
    }
  },
  computed: {
    ...mapState(['scriptList'])
  },
  created () {
    // Retrieve all scripts from server
    this.refreshScript()
    // Setup notification
    N.on(N.Script, notify => {
      this.refreshScript()
    })
  },
  methods: {
    handlePageSizeChange (pageSize) {
      this.pageSize = pageSize
    },
    handleCurrentPageChange (currentPage) {
      this.currentPage = currentPage
    },
    deleteScript (obj) {
      this.currentScript = obj.scriptName
      this.deleteDialogVisible = true
    },
    comfirmDelete () {
      API.deleteScript(this.currentScript)
        .then(res => {
          this.openSucessAlert(
            this.currentScript,
            '删除' + this.currentScript + '脚本包成功！'
          )
          this.deleteDialogVisible = false
        })
        .catch(error => {
          console.log(error)
          this.openErrorAlert(
            this.currentScript,
            '删除' + this.currentScript + '脚本包失败！'
          )
          this.deleteDialogVisible = false
        })
    },
    openSucessAlert (title, data) {
      this.successTitle = title
      this.successData = data
      this.showSuccess = true
      setTimeout(() => {
        this.closeSuccessAlert()
      }, 2000)
    },
    openErrorAlert (title, data) {
      this.errorTitle = title
      this.errorData = data
      this.showError = true
      setTimeout(() => {
        this.closeErrorAlert()
      }, 2000)
    },
    closeSuccessAlert () {
      this.showSuccess = false
      this.successTitle = ''
      this.successData = ''
    },
    closeErrorAlert () {
      this.showError = false
      this.errorTitle = ''
      this.errorData = ''
    },
    submitLocalUpload () {
      this.$refs.upload.submit()
    },
    submitRemoteUpload () {
      API.remoteUploadScript({
        scriptName: this.scriptName,
        description: this.description,
        scriptUri: 'http://' + this.remoteAddress
      }).then(res => {
        this.openSucessAlert(
          this.scriptName,
          '导入' + this.scriptName + '脚本包成功！'
        )
        this.scriptName = ''
        this.description = ''
        this.remoteAddress = ''
      }).catch(error => {
        if (error.response) {
          this.openErrorAlert(this.scriptName, error.response.data)
        }
        this.scriptName = ''
        this.description = ''
        this.remoteAddress = ''
      })
      this.uploadDialogVisible = false
    },
    refreshScript () {
      API.findAllScript()
        .then(res => {
          this.saveScriptToStore(res)
        })
        .catch(error => {
          return Promise.reject(error)
        })
    },
    httpRequest (params) {
      API.localUploadScript({
        scriptName: this.scriptName,
        description: this.description,
        file: params.file
      }).then(res => {
        this.openSucessAlert(
          this.scriptName,
          '导入' + this.scriptName + '脚本包成功！'
        )
        this.scriptName = ''
        this.description = ''
        this.fileList = []
        this.uploadDialogVisible = false
      }).catch(error => {
        if (error.response) {
          this.openErrorAlert(this.scriptName, error.response.data)
        }
        this.scriptName = ''
        this.description = ''
        this.fileList = []
        this.uploadDialogVisible = false
        return Promise.reject(error)
      })
    },
    onFileSuccess (response, file, fileList) {
      this.$message({
        message: '上传成功！',
        type: 'success'
      })
      this.fileList = []
    },
    // eslint-disable-next-line handle-callback-err
    onFileError (err, file, fileList) {
      this.$message({
        message: '上传失败！',
        type: 'error'
      })
    },
    handlePreview (file) {},
    handleRemove (file, fileList) {
      this.fileList = fileList
    },
    ...mapMutations(['saveScriptToStore'])
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/common';

.el-col-local-upload {
  margin-top: 10px;
  margin-bottom: 5px;
}

.el-col-remote-upload {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
