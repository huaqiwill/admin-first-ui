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
      <el-form-item label="生物名称" prop="biologyId">
        <el-input
          v-model="queryParams.biologyId"
          placeholder="请输入生物名称"
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
      <el-form-item label="首次发现时间" label-width="100px" prop="firstFoundTime">
        <el-date-picker
          clearable
          v-model="queryParams.firstFoundTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择首次发现时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="首次发现地点" label-width="100px" prop="firstFoundLocation">
        <el-input
          v-model="queryParams.firstFoundLocation"
          placeholder="请输入首次发现地点"
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
          v-hasPermi="['info:port_find:add']"
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
          v-hasPermi="['info:port_find:edit']"
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
          v-hasPermi="['info:port_find:remove']"
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
          v-hasPermi="['info:port_find:export']"
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
      :data="port_findList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="生物名称" align="center" prop="biologyName" />
      <el-table-column label="港口名称" align="center" prop="portName" />
      <el-table-column
        label="首次发现时间"
        align="center"
        prop="firstFoundTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.firstFoundTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="首次发现地点"
        align="center"
        prop="firstFoundLocation"
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
            v-hasPermi="['info:port_find:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['info:port_find:remove']"
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

    <!-- 添加或修改港口发现生物对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="生物名称" prop="biologyId">
          <el-select
            v-model="form.biologyId"
            placeholder="请输入生物名称"
            style="width: 100%"
          >
            <el-option
              v-for="biology in biologyNameList"
              :label="biology.name"
              :value="biology.id"
              :key="biology.id"
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
              :label="port.name"
              :value="port.id"
              :key="port.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="首次发现时间" prop="firstFoundTime">
          <el-date-picker
            clearable
            v-model="form.firstFoundTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择首次发现时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="首次发现地点" prop="firstFoundLocation">
          <el-input
            v-model="form.firstFoundLocation"
            placeholder="请输入首次发现地点"
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
import { listPort_find, getPort_find, delPort_find, addPort_find, updatePort_find } from "@/api/info/port_find";
import { portNameList } from '@/api/info/port';
import { biologyNameList } from '@/api/info/biology'

export default {
  name: "Port_find",
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
      // 港口发现生物表格数据
      port_findList: [],
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
        firstFoundTime: null,
        firstFoundLocation: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        biologyId: [{ required: true, message: "生物编号不能为空", trigger: "blur" }],
        portId: [{ required: true, message: "港口名称不能为空", trigger: "blur" }],
        firstFoundTime: [{ required: true, message: "首次发现时间不能为空", trigger: "blur" }],
        firstFoundLocation: [{ required: true, message: "首次发现地点不能为空", trigger: "blur" }],
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
    /** 查询港口发现生物列表 */
    getList() {
      this.loading = true;
      listPort_find(this.queryParams).then(response => {
        this.port_findList = response.rows;
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
        firstFoundTime: null,
        firstFoundLocation: null
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
      this.title = "添加港口发现生物";
      this.getBiologyNameList();
      this.getPortNameList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPort_find(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改港口发现生物";
        this.getBiologyNameList();
        this.getPortNameList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePort_find(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPort_find(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除港口发现生物编号为"' + ids + '"的数据项？').then(function () {
        return delPort_find(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('info/port_find/export', {
        ...this.queryParams
      }, `port_find_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
