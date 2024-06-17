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
      <el-form-item label="生物编号" prop="biologyId">
        <el-input
          v-model="queryParams.biologyId"
          placeholder="请输入生物编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="港口名称" prop="portId">
        <el-input
          v-model="queryParams.portId"
          placeholder="请输入港口名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="丰富度" prop="abundance">
        <el-input
          v-model="queryParams.abundance"
          placeholder="请输入丰富度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="丰富度百分比" label-width="98px" prop="abundanceRate">
        <el-input
          v-model="queryParams.abundanceRate"
          placeholder="请输入丰富度百分比"
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
          v-hasPermi="['info:port_check:add']"
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
          v-hasPermi="['info:port_check:edit']"
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
          v-hasPermi="['info:port_check:remove']"
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
          v-hasPermi="['info:port_check:export']"
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
      :data="port_checkList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="生物名称" align="center" prop="biologyName" />
      <el-table-column label="港口名称" align="center" prop="portName" />
      <el-table-column label="丰富度" align="center" prop="abundance" />
      <el-table-column
        label="丰富度百分比"
        align="center"
        prop="abundanceRate"
      />
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
            v-hasPermi="['info:port_check:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['info:port_check:remove']"
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

    <!-- 添加或修改港口检查生物对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-form-item label="生物名称" prop="biologyId">
          <el-select
            v-model="form.biologyId"
            placeholder="请输入生物编号"
            style="width: 100%"
          >
            <el-option
              v-for="biology in biologyNameList"
              :key="biology.id"
              :label="biology.name"
              :value="biology.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="港口名称" prop="portId">
          <el-select
            v-model="form.portId"
            placeholder="请输入港口名称"
            style="width: 100%"
          >
            <el-option
              v-for="port in portNameList"
              :key="port.id"
              :label="port.name"
              :value="port.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="丰富度" prop="abundance">
          <el-input v-model="form.abundance" placeholder="请输入丰富度" />
        </el-form-item>
        <el-form-item label="丰富度百分比" prop="abundanceRate">
          <el-input
            v-model="form.abundanceRate"
            placeholder="请输入丰富度百分比"
          />
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
import { listPort_check, getPort_check, delPort_check, addPort_check, updatePort_check } from "@/api/info/port_check";
import { portNameList } from '@/api/info/port';
import { biologyNameList } from '@/api/info/biology'

export default {
  name: "Port_check",
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
      // 港口检查生物表格数据
      port_checkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        biologyId: null,
        portId: null,
        abundance: null,
        abundanceRate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        biologyId: [{ required: true, message: "生物编号不能为空", trigger: "blur" }],
        portId: [{ required: true, message: "港口名称不能为空", trigger: "blur" }],
        abundance: [{ required: true, message: "丰富度不能为空", trigger: "blur" }],
        abundanceRate: [{ required: true, message: "丰富度百分比不能为空", trigger: "blur" }],
      },
      portNameList: [],
      biologyNameList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getPortNameList() {
      portNameList().then(res => {
        this.portNameList = res.data
      })
    },
    getBiologyNameList() {
      biologyNameList().then(res => {
        this.biologyNameList = res.data
      })
    },
    /** 查询港口检查生物列表 */
    getList() {
      this.loading = true;
      listPort_check(this.queryParams).then(response => {
        this.port_checkList = response.rows;
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
        biologyId: null,
        portId: null,
        abundance: null,
        abundanceRate: null
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
      this.title = "添加港口检查生物";
      this.getPortNameList();
      this.getBiologyNameList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPort_check(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改港口检查生物";
        this.getPortNameList();
        this.getBiologyNameList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePort_check(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPort_check(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除港口检查生物编号为"' + ids + '"的数据项？').then(function () {
        return delPort_check(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('info/port_check/export', {
        ...this.queryParams
      }, `port_check_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
