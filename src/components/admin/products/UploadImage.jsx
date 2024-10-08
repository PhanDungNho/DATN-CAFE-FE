import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, message, Modal, Upload } from "antd";

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

  const handleRemove = (info) => {
    if (info.name) {
      console.log("delete" + info.name);
    } else if (info.response && info.response.name) {
      console.log("delete" + info.response.name);
    }
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
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>

      <Modal
        open={preViewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <Image src={previewImage} alt="Preview image" style={{ width: "100%" }} />
      </Modal>
    </>
  );
};

export default UploadImage;
