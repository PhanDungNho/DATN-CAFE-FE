import React, { useContext, useEffect, useState, useMemo } from "react";
import { EditOutlined, HolderOutlined } from "@ant-design/icons";
import { Button, Space, Switch, Table, Tag } from "antd";
import { DndContext } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateProductOrdering } from "../../../redux/actions/productAction";

const RowContext = React.createContext({});
const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{
        cursor: "move",
      }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const columns = (editProduct, updateProductActive) => [
  {
    key: "sort",
    align: "center",
    width: 80,
    render: () => <DragHandle />,
  },
  {
    title: "STT",
    dataIndex: "ordering",
    width: "10%",
    key: "ordering",
    sorter: (a, b) => Number(b.id) - Number(a.id),
    showSorterTooltip: false,
  },
  {
    title: "Product ID",
    dataIndex: "id",
    width: "10%",
    key: "id",
    sorter: (a, b) => Number(b.id) - Number(a.id),
    showSorterTooltip: false,
  },
  {
    title: "Product Name",
    dataIndex: "name",
    width: "20%",
    key: "name",
  },
  {
    title: "Category",
    key: "category",
    render: (_, record) => {
      return record.category ? record.category.name : "No category";
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Active",
    dataIndex: "active",
    key: "active",
    width: 80,
    render: (_, { active }) => {
      let color = active ? "green" : "volcano";
      let statusText = active ? "Active" : "Inactive";
      return <Tag color={color}>{statusText}</Tag>;
    },
  },
  {
    title: "Action",
    key: "action",
    width: 150,
    align: "center",
    render: (_, record) => (
      <Space size="middle">
        <Button
          key={record.key}
          type="primary"
          size="small"
          onClick={() => editProduct(record)}
        >
          <EditOutlined style={{ marginRight: 8 }} /> Edit
        </Button>
        <Switch
          checked={record.active}
          onChange={(checked) => {
            updateProductActive(record.id, checked);
          }}
        />
      </Space>
    ),
  },
];

const Row = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 9999,
        }
      : {}),
  };

  const contextValue = useMemo(
    () => ({
      setActivatorNodeRef,
      listeners,
    }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const ProductList = ({ products, editProduct, updateProductActive }) => {
  const [data, setData] = useState(products);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
    },
  });

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setData((prevData) => {
        const activeIndex = prevData.findIndex((item) => item.id === active.id);
        const overIndex = prevData.findIndex((item) => item.id === over?.id);
        const newData = arrayMove(prevData, activeIndex, overIndex).map(
          (item, index) => ({ ...item, ordering: index + 1 })
        );
        console.log("List sau update ordering: ", newData);
        dispatch(updateProductOrdering(newData));
        return newData;
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(Array.isArray(products) ? products : []);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [products]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: sorter.order,
      sortField: sorter.field,
    });

    if (pagination.pageSize !== tableParams.pagination.pageSize) {
      setData(products);
    }
  };

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        items={data.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          columns={columns(editProduct, updateProductActive)}
          rowKey="id"
          dataSource={Array.isArray(data) ? data : []}
          loading={loading}
          components={{
            body: {
              row: Row,
            },
          }}
          pagination={{ ...tableParams.pagination }}
          onChange={handleTableChange}
          size="small"
          locale={{ emptyText: "Không có dữ liệu" }}
        />
      </SortableContext>
    </DndContext>
  );
};

export default ProductList;
