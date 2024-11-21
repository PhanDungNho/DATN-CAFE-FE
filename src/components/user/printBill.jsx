import ReactDOM from "react-dom";
import Bill from "./bill";
// Import component Bill

export const printBill = (order) => {
    const newWindow = window.open("", "_blank", "width=800,height=600");
    if (newWindow) {
        newWindow.document.title = "Hóa Đơn";

        // Tạo một div để chứa Bill
        const billContainer = document.createElement("div");
        newWindow.document.body.appendChild(billContainer);

        // Render hóa đơn vào div vừa tạo
        ReactDOM.render(<Bill billData={order} />, billContainer);

        // Đảm bảo nội dung được hiển thị
        newWindow.document.close();

        // Sử dụng setTimeout để đợi React render xong trước khi gọi print
        setTimeout(() => {
            newWindow.print();
        }, 500); // Chờ 500ms (có thể tăng lên nếu cần thiết)
    } else {
        alert("Cửa sổ bị chặn! Vui lòng cho phép pop-ups.");
    }
};
