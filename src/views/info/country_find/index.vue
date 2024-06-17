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
      <el-form-item label="国家名称" prop="countryId">
        <el-input
          v-model="queryParams.countryId"
          placeholder="请输入国家名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发现时间" prop="foundTime">
        <el-date-picker
          clearable
          v-model="queryParams.foundTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择发现时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发现位置" prop="foundLocation">
        <el-input
          v-model="queryParams.foundLocation"
          placeholder="请输入发现位置"
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
          v-hasPermi="['info:country_find:add']"
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
          v-hasPermi="['info:country_find:edit']"
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
          v-hasPermi="['info:country_find:remove']"
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
          v-hasPermi="['info:country_find:export']"
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
      :data="country_findList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="生物名称" align="center" prop="biologyName" />
      <el-table-column label="国家名称" align="center" prop="countryName" />
      <el-table-column
        label="发现时间"
        align="center"
        prop="foundTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.foundTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发现位置" align="center" prop="foundLocation" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="纬度" align="center" prop="latitude" />
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
            v-hasPermi="['info:country_find:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['info:country_find:remove']"
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

    <!-- 添加或修改国家发现生物对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="生物名称" prop="biologyId">
          <el-select
            v-model="form.biologyId"
            placeholder="请输入生物编号"
            style="width: 100%"
          >
            <el-option
              v-for="country in biologyNameList"
              :label="country.name"
              :value="country.id"
              :key="country.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家名称" prop="countryId">
          <el-select
            v-model="form.countryId"
            placeholder="请输入国家名称"
            style="width: 100%"
          >
            <el-option
              v-for="country in countryNameList"
              :label="country.name"
              :value="country.id"
              :key="country.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发现时间" prop="foundTime">
          <el-date-picker
            style="width: 100%"
            clearable
            v-model="form.foundTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发现时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发现位置" prop="foundLocation">
          <el-input v-model="form.foundLocation" placeholder="请输入发现位置" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" />
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
import { listCountry_find, getCountry_find, delCountry_find, addCountry_find, updateCountry_find } from "@/api/info/country_find";
import { countryNameList } from '@/api/info/country';
import { biologyNameList } from '@/api/info/biology';

export default {
  name: "Country_find",
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
      // 国家发现生物表格数据
      country_findList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        biologyId: null,
        countryId: null,
        foundTime: null,
        foundLocation: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        biologyId: [{ required: true, message: "国家编号不能为空", trigger: "blur" }],
        countryId: [{ required: true, message: "国家名称不能为空", trigger: "blur" }],
        foundTime: [{ required: true, message: "发现时间不能为空", trigger: "blur" }],
        foundLocation: [{ required: true, message: "发现位置不能为空", trigger: "blur" }],
        longitude: [{ required: true, message: "经度不能为空", trigger: "blur" }],
        latitude: [{ required: true, message: "维度不能为空", trigger: "blur" }]
      },
      countryNameList: [],
      biologyNameList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getBiologyNameList() {
      biologyNameList().then(res => {
        this.biologyNameList = res.data
      })
    },
    getCountryNameList() {
      countryNameList().then(res => {
        this.countryNameList = res.data;
      })
    },
    /** 查询国家发现生物列表 */
    getList() {
      this.loading = true;
      listCountry_find(this.queryParams).then(response => {
        this.country_findList = response.rows;
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
        countryId: null,
        foundTime: null,
        foundLocation: null,
        longitude: null,
        latitude: null
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
      this.title = "添加国家发现生物";
      this.getCountryNameList();
      this.getBiologyNameList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCountry_find(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改国家发现生物";
        this.getCountryNameList();
        this.getBiologyNameList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCountry_find(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCountry_find(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除国家发现生物编号为"' + ids + '"的数据项？').then(function () {
        return delCountry_find(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('info/country_find/export', {
        ...this.queryParams
      }, `country_find_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
