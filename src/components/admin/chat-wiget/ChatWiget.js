import React, { useState, useEffect, useRef } from "react";

const ChatWidget = ({ apiUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState("Bot is typing");

  const chatBoxRef = useRef(null);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    setTimeout(() => {
      if (!isOpen && chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setMessages((prev) => [...prev, { sender: "user", message: userMessage }]);
    setUserInput("");
    setIsLoading(true);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            message: data.response || "Sorry, the bot hasn't responded yet.",
          },
        ]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", message: "Sorry, the bot hasn't responded yet!" },
        ]);
      })
      .finally(() => setIsLoading(false));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Hiệu ứng Bot is typing...
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setTypingText((prev) =>
          prev === "Bot is typing...." ? "Bot is typing" : prev + "."
        );
      }, 500);
    } else {
      setTypingText("Bot is typing");
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div>
      {!isOpen && (
        <button
          onClick={toggleChat}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "12px 25px",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
            zIndex: 1001,
          }}
        >
          Chat
        </button>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "420px",
            height: "530px",
            background: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: "15px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "'Arial', sans-serif",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #007bff, #0056b3)",
              color: "white",
              padding: "15px",
              textAlign: "left",
              fontSize: "20px",
              fontWeight: "bold",
              position: "relative",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Wala AI Assistant</span>
            <button
              onClick={toggleChat}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#cccccc")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
            >
              x
            </button>
          </div>
          <div
            ref={chatBoxRef}
            style={{
              flexGrow: 1,
              padding: "15px",
              overflowY: "scroll",
              background: "white",
              borderTop: "1px solid #eee",
              position: "relative",
              // Ẩn thanh cuộn khi không cần thiết
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* Internet Explorer 10+ */,
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                {msg.sender === "bot" && (
                  <img
                    src="/assets/img/logo1.png"
                    alt="Avatar"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                )}
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "10px 15px",
                    borderRadius: "15px",
                    backgroundColor:
                      msg.sender === "user" ? "#007bff" : "#f1f1f1",
                    color: msg.sender === "user" ? "white" : "#333",
                    lineHeight: "1.5",
                    wordBreak: "break-word",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: msg.message.replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            ))}
          </div>
          {isLoading && (
            <div
              style={{
                padding: "10px 15px",
                color: "#888",
                fontStyle: "italic",
                fontSize: "14px",
                backgroundColor: "#fff",
              }}
            >
              <span>{typingText}</span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              padding: "10px",
              background: "#fff",
              borderTop: "1px solid #ddd",
            }}
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your question..."
              style={{
                flexGrow: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "20px",
                outline: "none",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "20px",
                marginLeft: "10px",
                padding: "10px 20px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
