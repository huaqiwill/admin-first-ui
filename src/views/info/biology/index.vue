<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="生物编号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入生物编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生物名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入生物名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生物门属" prop="men">
        <el-input
          v-model="queryParams.men"
          placeholder="请输入生物门属"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="拉丁名" prop="latin">
        <el-input
          v-model="queryParams.latin"
          placeholder="请输入拉丁名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['info:biology:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['info:biology:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['info:biology:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['info:biology:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="biologyList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="生物编号" align="center" prop="num" />
      <el-table-column label="生物名称" align="center" prop="name" />
      <el-table-column label="生物门属" align="center" prop="men" />
      <el-table-column label="生物危害" align="center" prop="harm" />
      <el-table-column
        label="世界分布"
        align="center"
        prop="worldDistribution"
      />
      <el-table-column label="拉丁名" align="center" prop="latin" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['info:biology:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['info:biology:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改生物信息管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="生物编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入生物编号" />
        </el-form-item>
        <el-form-item label="生物名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入生物名称" />
        </el-form-item>
        <el-form-item label="生物门属" prop="men">
          <el-input v-model="form.men" placeholder="请输入生物门属" />
        </el-form-item>
        <el-form-item label="生物危害" prop="harm">
          <el-input
            v-model="form.harm"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="世界分布" prop="worldDistribution">
          <el-input
            v-model="form.worldDistribution"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="拉丁名" prop="latin">
          <el-input v-model="form.latin" placeholder="请输入拉丁名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBiology, getBiology, delBiology, addBiology, updateBiology } from "@/api/info/biology";

export default {
  name: "Biology",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生物信息管理表格数据
      biologyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        num: null,
        name: null,
        men: null,
        harm: null,
        latin: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        num: [
          { required: true, message: "生物编号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "生物名称不能为空", trigger: "blur" }
        ],
        men: [
          { required: true, message: "生物门属不能为空", trigger: "blur" }
        ],
        harm: [
          { required: true, message: "生物危害不能为空", trigger: "blur" }
        ],
        worldDistribution: [
          { required: true, message: "世界分布不能为空", trigger: "blur" }
        ],
        latin: [
          { required: true, message: "拉丁名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询生物信息管理列表 */
    getList() {
      this.loading = true;
      listBiology(this.queryParams).then(response => {
        this.biologyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        num: null,
        name: null,
        men: null,
        harm: null,
        worldDistribution: null,
        latin: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加生物信息管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBiology(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改生物信息管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBiology(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBiology(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除生物信息管理编号为"' + ids + '"的数据项？').then(function () {
        return delBiology(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('info/biology/export', {
        ...this.queryParams
      }, `biology_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
