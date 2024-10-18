import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, message, Modal, Upload, Popconfirm } from "antd";
import PropTypes from "prop-types";
import axios from "axios";
import { API_PRODUCT } from "../../../services/constant";

const UploadImage = (props) => {
  const [preViewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (info) => {
    const { fileList } = info;
    const status = info.file.status;

    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (status === "removed") {
      message.success(`${info.file.name} file is removed`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed`);
    }

    props.onUpdateFileList(fileList.slice());
  };

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleRemove = (file) => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure to delete this file?",
        onOk: async () => {
          try {
            props.onUpdateFileList(
              props.fileList.filter((item) => item.uid !== file.uid)
            );
  
            resolve(true);
            await axios.delete(API_PRODUCT + "/images/" + file.name, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            });
          } catch (error) {
            // message.error(`Failed to remove ${file.name} from database`);
            resolve(false);
          }
        },
        onCancel: () => {
          message.error("File removal canceled");
          resolve(false);
        },
      });
    });
  };
  
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 10 }}>Upload</div>
    </div>
  );

  const { fileList } = props;

  const headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  const handleUploadClick = (e) => {
    if (fileList.length >= 8) {
      e.preventDefault();
      message.warning("You can only upload up to 8 files.");
    }
  };

  return (
    <>
      <Upload
        name="file"
        listType="picture-card"
        defaultFileList={fileList}
        multiple={true}
        headers={headers}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove} 
        beforeUpload={() => false} 
      >
        <div onClick={handleUploadClick}>
          {fileList.length >= 8 ? null : uploadButton}
        </div>
      </Upload>

      <Modal
        open={preViewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <Image
          src={previewImage}
          alt="Preview image"
          style={{ width: "100%" }}
        />
      </Modal>
    </>
  );
};

UploadImage.propTypes = {
  onDeleteProductImage: PropTypes.func.isRequired,
  onUpdateFileList: PropTypes.func.isRequired,
  fileList: PropTypes.array.isRequired,
};

export default UploadImage;
