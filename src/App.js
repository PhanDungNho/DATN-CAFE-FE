import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* import */
import Index from "./components/index";
import Cart from "./components/cart";
import Checkout from "./components/checkout";
import Shop from "./components/shop";
import Product from "./components/single-product";
import NotFound from "./components/404";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const sticker = $("#sticker");
    const stickerPosition = sticker.offset().top;

    const handleScroll = () => {
      const scrollTop = $(window).scrollTop();

      if (scrollTop > stickerPosition) {
        sticker.addClass("is-sticky");
      } else {
        sticker.removeClass("is-sticky");
      }
    };

    $(window).on("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      $(window).off("scroll", handleScroll);
    };
  }, []);
  return (
    <Router>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/single-product" element={<Product />} />
        </Routes>
        <Footer />
      </>
    </Router>
  );
}

export default App;
