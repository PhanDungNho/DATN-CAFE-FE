import React, { useState, useEffect, useRef } from "react";
import { FaFacebookMessenger } from "react-icons/fa";

const ChatWidget = ({
  apiUrl,
  avatarUrl = "../../../../public/assets/img/logo1.png",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  // Tạo ref cho div chứa tin nhắn
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setMessages([...messages, { sender: "user", message: userMessage }]);
    setUserInput("");

    try {
      const fetchWithRetry = async (retries) => {
        for (let i = 0; i < retries; i++) {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userMessage }),
          });

          if (response.ok) {
            return response.json();
          }

          if (response.status === 503) {
            console.log("Mô hình bị quá tải, thử lại...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
        throw new Error("Có lỗi xảy ra khi gọi API");
      };

      const data = await fetchWithRetry(3);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          message: data.response || "Xin lỗi, bot chưa phản hồi.",
        },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: "Xin lỗi, có lỗi xảy ra!" },
      ]);
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  // Tự động cuộn xuống cuối khi tin nhắn thay đổi
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngừng hành động mặc định của Enter (thường là xuống dòng)
      handleSendMessage(); // Gửi tin nhắn
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FF6F00, #FFFF33)", // Gradient nút gửi
          color: "white",
          border: "none",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
          cursor: "pointer",
          transition:
            "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background 0.3s ease-in-out, opacity 0.3s ease",
          display: isOpen ? "none" : "block",
          opacity: isOpen ? 0.6 : 1,
          zIndex: 1000,
        }}
      >
        <FaFacebookMessenger style={{ fontSize: 32 }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "50px",
            right: "20px",
            width: "400px",
            height: "500px",
            borderRadius: "15px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
            backgroundColor: "linear-gradient(135deg, #FFF3E0, #FFCC80)", // Gradient nền khung chat
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "'Roboto', sans-serif",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #FF6F00, #FFFF33)", // Gradient nút gửi
              color: "white",
              padding: "15px",
              fontSize: "18px",
              textAlign: "center",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              <FaFacebookMessenger style={{ fontSize: 24 }} /> Trợ lý AI
            </span>
            <button
              onClick={toggleChat}
              style={{
                background: "none",
                border: "none",
                color: "black",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
          <div
            style={{
              flexGrow: "1",
              overflowY: "auto",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              padding: "15px",
              background: "linear-gradient(135deg, #FFEBEE, #FFCDD2)",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                {msg.sender === "bot" ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`/assets/img/logo1.png`}
                      alt="Avatar"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        background: "linear-gradient(135deg, #FF6F00, #FFFF33)",
                        color: "white",
                        padding: "10px 15px",
                        borderRadius: "20px",
                        maxWidth: "70%",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {msg.message}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: "5px 10px",
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(135deg, #FF6F00, #FFFF33)",
                        color: "white",
                        padding: "10px 15px",
                        borderRadius: "20px",
                        maxWidth: "70%",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {msg.message}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
              background: "linear-gradient(135deg, #FFEBEE, #FFCDD2)", // Gradient nền cho khung nhập liệu
            }}
          >
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              style={{
                flexGrow: "1",
                padding: "12px 16px",
                border: "1px solid #ccc",
                borderRadius: "25px",
                fontSize: "16px",
                color: "#333",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                marginLeft: "12px",
                background: "linear-gradient(135deg, #FF6F00, #FFFF33)",
                color: "white",
                padding: "12px 28px",
                borderRadius: "30px",
                cursor: "pointer",
                border: "none",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
