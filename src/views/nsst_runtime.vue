<template>
  <div>
    <div class="mwin">
      <div class="titlebar">
        <h2 class="title">
          <i class="el-icon-edit-outline"></i>
          NSST模板管理
        </h2>
        <div class="btnbar">
          <el-button
            size="small"
            type="primary"
            plain
            icon="el-icon-search"
            @click="searchNsst = true"
          >查询NSST模板</el-button>
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
          :data="runtimeNsstList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
          style="width: 100%;"
        >
          <el-table-column label="NSST ID" prop="id"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="版本" prop="version"></el-table-column>
          <el-table-column label="厂商" prop="vendor"></el-table-column>
          <el-table-column label="切片业务类型">
            <template slot-scope="scope">
              <span>{{sstObj[scope.row.sst]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="专业域类型" prop="domainType"></el-table-column>
          <el-table-column width="450px" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-delete"
                @click="deleteRuntimeNSST(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="success"
                icon="el-icon-edit"
                @click="updateRuntimeNSST(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="info"
                icon="el-icon-copy-document"
                @click="saveRuntimeNSST(scope.row)"
              >另存</el-button>
              <el-button
                class="btn-mr"
                size="mini"
                @click="downloadRuntimeNsst(scope.row)"
                type="warning"
                icon="el-icon-download"
              >导出</el-button>
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
            :total="runtimeNsstList.length"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="导入NSST模板"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="uploadDialogVisible"
      width="30%"
    >
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
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadDialogVisible = false">取 消</el-button>
        <el-button
          size="small"
          style="margin-left: 10px;"
          type="success"
          icon="el-icon-upload"
          @click="submitUpload"
        >上载NSST模板</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="删除NSST模板"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <el-radio-group v-model="deleteNsstOpt">
        <el-row style="margin-bottom:10px;">
          <el-radio label="0">删除当前版本的NSST</el-radio>
        </el-row>
        <el-row style="margin-bottom:10px;">
          <el-radio label="1">删除所有版本的NSST</el-radio>
        </el-row>
      </el-radio-group>
      <div>
        确认删除
        <span class="keyword">NSST标识:{{currentNsst.id}}</span> ?
      </div>
      <span slot="footer">
        <el-button size="small" @click="deleteDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import API from '@/data/api.js'
import N from '@/data/notification.js'

export default {
  data () {
    return {
      // pagination
      currentPage: 1,
      pageSize: 10,
      searchNsst: false,
      sstObj: {
        1: 'EMBB',
        2: 'URLLC',
        3: 'MIOT'
      },
      currentNsst: {},
      fileList: [],
      isUploadErr: false,
      uploadErrText: '',
      uploadDialogVisible: false,
      deleteDialogVisible: false,
      deleteNsstOpt: '0'
    }
  },
  computed: {
    ...mapState(['runtimeNsstList'])
  },
  created () {
    // Retrieve all scripts from server
    this.refreshRuntimeNsst()
    // Setup notification
    N.on(N.RUNTIME_NSST, notify => {
      this.refreshRuntimeNsst()
    })
  },
  methods: {
    handlePageSizeChange (pageSize) {
      this.pageSize = pageSize
    },
    handleCurrentPageChange (currentPage) {
      this.currentPage = currentPage
    },
    refreshRuntimeNsst () {
      API.findAllRuntimeNsst()
        .then(res => {
          this.saveRuntimeNsstToStore(res)
        })
        .catch(error => {
          return Promise.reject(error)
        })
    },
    httpRequest (params) {
      API.uploadRuntimeNsst({
        file: params.file
      })
        .then(res => {
          this.openSucessAlert(
            params.file.name,
            '导入' + params.file.name + '模板成功！'
          )
          this.fileList = []
          this.uploadDialogVisible = false
        })
        .catch(error => {
          if (error.response) {
            this.openErrorAlert(params.file.name, error.response.data)
          }
          this.fileList = []
          this.uploadDialogVisible = false
          return Promise.reject(error)
        })
    },
    submitUpload () {
      this.$refs.upload.submit()
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
    deleteRuntimeNSST (row) {
      this.currentNsst = row
      this.deleteDialogVisible = true
    },
    deleteCurrentVersion () {
      API.deleteNsst({
        id: this.currentNsst.id,
        versions: [this.currentNsst.version]
      })
        .then(res => {
          this.openSucessAlert(
            this.currentNsst.name,
            '删除' + this.currentNsst.name + '模板成功！'
          )
          this.deleteDialogVisible = false
        })
        .catch(error => {
          console.log(error)
          this.openErrorAlert(
            this.currentNsst.name,
            '删除' + this.currentNsst.name + '模板失败！'
          )
          this.deleteDialogVisible = false
        })
    },
    deleteAllVersion () {
      API.deleteNsst({
        id: this.currentNsst.id
      })
        .then(res => {
          this.openSucessAlert(
            this.currentNsst.name,
            '删除' + this.currentNsst.name + '模板成功！'
          )
          this.deleteDialogVisible = false
        })
        .catch(error => {
          console.log(error)
          this.openErrorAlert(
            this.currentNsst.name,
            '删除' + this.currentNsst.name + '模板失败！'
          )
          this.deleteDialogVisible = false
        })
    },
    confirmDelete () {
      switch (this.deleteNsstOpt) {
        case '0':
          this.deleteCurrentVersion()
          break
        case '1':
          this.deleteAllVersion()
          break
      }
    },
    updateRuntimeNSST (row) {},
    saveRuntimeNSST (row) {},
    downloadRuntimeNsst (row) {
      API.downloadNsst({
        id: row.id,
        version: row.version
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
    ...mapMutations(['saveRuntimeNsstToStore'])
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/common';

.keyword {
  color: #409eff;
  font-weight: bold;
}
</style>
