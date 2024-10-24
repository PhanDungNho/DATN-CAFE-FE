import React, { Component } from "react";
import { Button, Form, Input, Popconfirm, Table, Select } from "antd";

const EditableContext = React.createContext(null);

class EditableRow extends Component {
  variantFormRef = React.createRef();

  render() {
    const { ...props } = this.props;
    return (
      <Form ref={this.variantFormRef} component={false}>
        <EditableContext.Provider value={this.variantFormRef.current}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  }
}

class EditableCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
    this.inputRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editing && !prevState.editing) {
      this.inputRef.current?.focus();
    }
  }

  toggleEdit = () => {
    const { dataIndex, record } = this.props;
    this.setState({ editing: !this.state.editing }, () => {
      if (this.state.editing && this.form) {
        this.form.setFieldsValue({
          [dataIndex]: record[dataIndex] ? record[dataIndex].id : undefined,
        });
      }
    });
  };

  save = async () => {
    if (!this.form) {
      console.error("Form is not available");
      return;
    }

    try {
      const values = await this.form.validateFields();
      this.toggleEdit();
      this.props.handleSave({
        ...this.props.record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  render() {
    const {
      title,
      editable,
      children,
      dataIndex,
      record,
      sizes,
      size,
      handleSave,
      ...restProps
    } = this.props;
    const { editing } = this.state;
    this.form = this.context;

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          {dataIndex === "active" ? (
            <Select
              ref={this.inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  this.save();
                }
              }}
              onBlur={this.save}
              placeholder="Select Status"
            >
              <Select.Option value={true}>Visible</Select.Option>
              <Select.Option value={false}>In-Visible</Select.Option>
            </Select>
          ) : dataIndex === "sizeId" ? (
            <Select
              ref={this.inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  this.save();
                }
              }}
              onBlur={this.save}
              placeholder="Select Size"
            >
              {sizes.map((size) => (
                <Select.Option value={size.id} key={size.id}>
                  {size.name}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <Input
              ref={this.inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  this.save();
                }
              }}
              onBlur={this.save}
            />
          )}
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingInlineEnd: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  }
}

EditableCell.contextType = EditableContext;

class ProductVariantForm extends Component {
  constructor(props) {
    super(props);

    const defaultSize =
      props.sizes && props.sizes.length > 0
        ? props.sizes[0]
        : { id: 1, name: "S", sizeId: 1 };

    // const productVariants =
    //   (props.products && props.products.productVariants) || [];

    this.state = {
      dataSource:
        props.productVariants.length > 0
          ? props.productVariants.map((variant) => ({
              id: variant.id,
              key: variant.id,
              size: variant.size || defaultSize,
              sizeId: variant.sizeId,
              price: variant.price,
              active: variant.active,
            }))
          : [
              {
                key: "0",
                size: defaultSize,
                sizeId: "1",
                price: 0,
                active: true,
              },
            ],
      count: props.productVariants.length || 1,
    };
  }

  getFieldsValue = () => {
    return this.state.dataSource;
  };

  handleDelete = (key) => {
    const newData = this.state.dataSource.filter((item) => item.key !== key);
    this.setState({ dataSource: newData });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count.toString(),
      size: { id: this.props.sizes[0].id, name: this.props.sizes[0].name },
      price: 0,
      active: true,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    const selectedSize = this.props.sizes.find(
      (size) => size.id === row.sizeId
    );
    const sizeName = selectedSize ? selectedSize.name : item.size.name;

    newData.splice(index, 1, {
      ...item,
      ...row,
      size: {
        id: row.sizeId,
        name: sizeName,
      },
      price: row.price,
      sizeId: row.sizeId,
      active: row.active === true,
    });

    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state;
    console.log("ProductVariantForm: ", dataSource);

    const defaultColumns = [
      {
        title: "Size",
        editable: true,
        width: "30%",
        name: "sizeId",
        dataIndex: "sizeId",
        render: (_, record) => {
          return record.size ? record.size.name : "No size";
        },
      },
      {
        title: "Price",
        dataIndex: "price",
        editable: true,
        width: "30%",
      },
      {
        title: "Active",
        dataIndex: "active",
        editable: true,
        width: "30%",
        render: (text) => (text ? "Visible" : "In-Visible"),
      },
      {
        title: "Operation",
        dataIndex: "operation",
        render: (_, record) =>
          dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const columns = defaultColumns.map((col) => ({
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex === "size" ? "sizeId" : col.dataIndex,
        title: col.title,
        handleSave: this.handleSave,
        sizes: this.props.sizes,
      }),
    }));

    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{ marginBottom: 10 }}
        >
          Add a Variant
        </Button>

        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

export default ProductVariantForm;
