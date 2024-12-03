import React, { forwardRef, useImperativeHandle } from "react";
import { Table, Select, Button, InputNumber } from "antd";

const ProductVariantForm = forwardRef((props, ref) => {
  const { sizes, productVariants } = props;
  const [dataSource, setDataSource] = React.useState(
    productVariants.length > 0
      ? productVariants.map((variant) => ({
          id: variant.id || 0,
          key: variant.id,
          sizeId: variant.sizeId,
          price: variant.price,
          active: variant.active,
        }))
      : [
          {
            key: "0",
            id: 0,
            sizeId: 1,
            price: 0,
            active: true,
          },
        ]
  );

  useImperativeHandle(ref, () => ({
    getFieldsValue: () => dataSource,
  }));

  const handleAdd = () => {
    // Lấy danh sách các sizeId đã được chọn
    const selectedSizeIds = dataSource.map((item) => item.sizeId);

    // Tìm size chưa được chọn
    const availableSize = sizes.find(
      (size) => !selectedSizeIds.includes(size.id) && size.active
    );

    if (availableSize) {
      const newData = {
        id: 0,
        key: Date.now() + Math.random(),
        sizeId: availableSize.id, // Chọn size tiếp theo chưa được sử dụng
        price: 0,
        active: true,
      };
      setDataSource((prev) => [...prev, newData]);
    }
  };

  // Kiểm tra tất cả các size đã được chọn để vô hiệu hóa nút Add
  const allSizesSelected = sizes.every((size) =>
    dataSource.some((item) => item.sizeId === size.id)
  );

  const handleDelete = (key) => {
    setDataSource((prev) => prev.filter((item) => item.key !== key));
  };

  const handleSave = (row) => {
    setDataSource((prev) => {
      const index = prev.findIndex((item) => row.key === item.key);
      if (index > -1) {
        const newData = [...prev];
        newData.splice(index, 1, { ...newData[index], ...row });
        return newData;
      } else {
        return [...prev, row];
      }
    });
  };

  const columns = [
    {
      title: "Size",
      dataIndex: "sizeId",
      width: "35%",
      render: (text, record) => {
        const selectedSizes = dataSource
          .filter((item) => item.key !== record.key)
          .map((item) => item.sizeId);

        return (
          <Select
            defaultValue={record.sizeId}
            style={{ width: "100%" }}
            onChange={(value) => handleSave({ ...record, sizeId: value })}
          >
            {sizes
              .filter((item) => item.active && !selectedSizes.includes(item.id)) // Ẩn size đã chọn ở các hàng khác
              .map((size) => (
                <Select.Option key={size.id} value={size.id}>
                  {size.name}
                </Select.Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "35%",
      render: (text, record) => (
        <InputNumber
          min={0}
          value={record.price}
          addonBefore={"VND"}
          formatter={(value) => {
            if (!value) return "";
            return ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }}
          parser={(value) => value.replace(/VND\s?|(,*)/g, "")}
          onChange={(value) => handleSave({ ...record, price: value })}
          style={{ width: "100%" }}
        />
      ),
    },

    {
      title: "Active",
      dataIndex: "active",
      width: "15%",
      render: (text, record) => (
        <Select
          defaultValue={record.active ? true : false}
          style={{ width: "100%" }}
          onChange={(value) => handleSave({ ...record, active: value })}
        >
          <Select.Option key="Visible" value={true}>
            Visible
          </Select.Option>
          <Select.Option key="In-Visible" value={false}>
            In-Visible
          </Select.Option>
        </Select>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      render: (_, record) => {
        if (record.id === 0) {
          return (
            <Button
              onClick={() => handleDelete(record.key)}
              type="link"
              danger
              style={{ width: "100%" }}
              key={record.key}
            >
              Delete
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <>
      <Button
        onClick={handleAdd}
        type="dashed"
        style={{ marginBottom: 16 }}
        disabled={allSizesSelected} // Vô hiệu hóa nếu tất cả các size đã được chọn
      >
        Add Variant
      </Button>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowClassName="editable-row"
        rowKey="key"
        bordered
      />
    </>
  );
});

export default ProductVariantForm;
