document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // Hiển thị lỗi ngay dưới input
  function showError(input, message) {
    let small = input.nextElementSibling;
    if (!small || small.tagName !== "SMALL") {
      small = document.createElement("small");
      input.parentNode.appendChild(small);
    }
    small.textContent = message;
    small.classList.add("text-danger");
    input.classList.add("is-invalid");
  }

  // Xóa lỗi khi nhập đúng
  function clearError(input) {
    let small = input.nextElementSibling;
    if (small && small.tagName === "SMALL") {
      small.textContent = "";
    }
    input.classList.remove("is-invalid");
  }

  // Kiểm tra đầu vào theo regex
  function validateInput(input, regex, errorMessage) {
    if (!regex.test(input.value.trim())) {
      showError(input, errorMessage);
      return false;
    } else {
      clearError(input);
      return true;
    }
  }

  // Kiểm tra ngày sinh hợp lệ
  function validateBirthdate(input) {
    if (!input.value) {
      showError(input, "Vui lòng chọn ngày sinh.");
      return false;
    } else {
      clearError(input);
      return true;
    }
  }

  // Kiểm tra mật khẩu nhập lại
  function validateConfirmPassword(password, confirmPassword) {
    if (password.value !== confirmPassword.value) {
      showError(confirmPassword, "Mật khẩu nhập lại không khớp.");
      return false;
    } else {
      clearError(confirmPassword);
      return true;
    }
  }

  // Xử lý form đăng nhập
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("login-username");
      const password = document.getElementById("login-password");
      let isValid = true;

      if (
        !validateInput(
          username,
          /^[a-zA-Z][a-zA-Z0-9_.]{4,19}$/,
          "Tên đăng nhập phải bắt đầu bằng chữ cái, dài 5-20 ký tự."
        )
      ) {
        isValid = false;
      }
      if (
        !validateInput(
          password,
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
        )
      ) {
        isValid = false;
      }

      if (!isValid) return;

      // Lấy danh sách người dùng đã đăng ký từ localStorage
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Kiểm tra thông tin đăng nhập
      const user = users.find(
        (u) =>
          u.username === username.value.trim() && u.password === password.value
      );

      if (user) {
        alert("Đăng nhập thành công! Chuyển hướng đến trang chủ...");
        setTimeout(() => {
          window.location.href = "../index.html"; // Chuyển hướng đến trang chính
        }, 2000);
      } else {
        showError(username, "Tên đăng nhập hoặc mật khẩu không đúng.");
        showError(password, "Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    });
  }

  // Xử lý form đăng ký
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const fullname = document.getElementById("register-fullname");
      const birthdate = document.getElementById("register-birthdate");
      const email = document.getElementById("register-email");
      const phone = document.getElementById("register-phone");
      const username = document.getElementById("register-username");
      const password = document.getElementById("register-password");
      const confirmPassword = document.getElementById(
        "register-confirm-password"
      );

      let isValid = true;

      if (
        !validateInput(
          fullname,
          /^[a-zA-ZÀ-ỹ\s]{3,}$/,
          "Họ và tên chỉ chứa chữ cái, tối thiểu 3 ký tự."
        )
      )
        isValid = false;
      if (!validateBirthdate(birthdate)) isValid = false;
      if (
        !validateInput(
          email,
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email không hợp lệ!"
        )
      )
        isValid = false;
      if (
        !validateInput(
          phone,
          /^0\d{9}$/,
          "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0."
        )
      )
        isValid = false;
      if (
        !validateInput(
          username,
          /^[a-zA-Z][a-zA-Z0-9_.]{4,19}$/,
          "Tên đăng nhập phải bắt đầu bằng chữ cái, dài 5-20 ký tự."
        )
      )
        isValid = false;
      if (
        !validateInput(
          password,
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
        )
      )
        isValid = false;
      if (!validateConfirmPassword(password, confirmPassword)) isValid = false;

      if (!isValid) return;

      // Tạo đối tượng người dùng
      const user = {
        fullname: fullname.value.trim(),
        birthdate: birthdate.value,
        email: email.value.trim(),
        phone: phone.value.trim(),
        username: username.value.trim(),
        password: password.value,
      };

      // Lấy danh sách người dùng đã lưu (nếu có)
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Kiểm tra xem username đã tồn tại chưa
      if (users.some((u) => u.username === user.username)) {
        showError(
          username,
          "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác."
        );
        return;
      }

      // Thêm người dùng mới vào danh sách
      users.push(user);

      // Lưu danh sách vào localStorage
      localStorage.setItem("users", JSON.stringify(users));

      // Hiển thị thông báo và chuyển hướng
      alert("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        window.location.href = "dang_nhap.html"; // Chuyển hướng đến trang đăng nhập
      }, 2000);
    });

    // Kiểm tra lỗi ngay khi nhập dữ liệu
    document.querySelectorAll("#register-form input").forEach((input) => {
      input.addEventListener("input", () => clearError(input));
    });
  }

  // Lắng nghe sự kiện click nút Xóa
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-user")) {
      const index = event.target.getAttribute("data-index");

      if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
        users.splice(index, 1); // Xóa người dùng khỏi mảng
        localStorage.setItem("users", JSON.stringify(users)); // Cập nhật vào localStorage
        renderUserList(); // Cập nhật danh sách trên giao diện
        alert("Xóa người dùng thành công!");
      }
    }
  });

  // Khởi tạo carousel tự động chạy sau 3 giây, dừng khi hover, và cho phép lặp lại
  let carouselElement = document.querySelector("#carouselId");
  if (carouselElement) {
    var myCarousel = new bootstrap.Carousel(carouselElement, {
      interval: 3000,
      pause: "hover",
      wrap: true,
    });
  }

  // Lấy các phần tử liên quan đến giỏ hàng
  const cartToggle = document.getElementById("cart-toggle");
  const cart = document.getElementById("cart");
  const cartClose = document.getElementById("cart-close");
  const cartBody = document.getElementById("cart-body");
  const cartTotal = document.getElementById("cart-total");

  let cartItems = []; // Mảng chứa các sản phẩm trong giỏ hàng
  let totalAmount = 0; // Tổng số tiền trong giỏ hàng

  // Hiển thị hoặc ẩn giỏ hàng khi nhấn nút toggle
  cartToggle.addEventListener("click", () => {
    cart.classList.add("show-cart");
  });

  // Ẩn giỏ hàng khi nhấn nút close
  cartClose.addEventListener("click", () => {
    cart.classList.remove("show-cart");
    cart.style.display = "none";
  });

  // Cập nhật hiển thị giỏ hàng
  function updateCart() {
    cartBody.innerHTML = cartItems.length
      ? cartItems
          .map(
            (item, index) => `
          <div class="cart-item d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
            <div class="d-flex align-items-center">
              <img src="${item.image}" alt="${item.name}" 
                   class="cart-item-img" 
                   style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
              <div class="ms-3">
                <p class="mb-1"><strong>${item.name}</strong></p>
                <p class="text-muted mb-0">
                  Màu: ${item.color}, Size: ${item.size}, Số lượng: ${
              item.quantity
            }
                </p>
                <p class="mb-0"><strong>${(
                  item.price * item.quantity
                ).toLocaleString()} đ</strong></p>
              </div>
            </div>
            <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Xóa</button>
          </div>`
          )
          .join("")
      : '<p class="pt-2">Giỏ hàng của bạn trống.</p>';

    cartTotal.innerText = totalAmount.toLocaleString();
    attachRemoveEvents();
  }

  // Xóa sản phẩm khỏi giỏ hàng
  function attachRemoveEvents() {
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        totalAmount -= cartItems[index].price * cartItems[index].quantity;
        cartItems.splice(index, 1);
        updateCart();
      });
    });
  }

  let isQuickBuy = false;
  let quickBuyItems = [];

  // Hàm hiển thị modal thanh toán (sửa đổi)
  function showCheckoutModal(items) {
    const itemsContainer = document.getElementById("checkout-items");
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    itemsContainer.innerHTML = items
      .map(
        (item) => `
      <div class="d-flex mb-2">
        <img src="${item.image}" class="me-2" width="50" height="50">
        <div>
          <div>${item.name}</div>
          <small class="text-muted">
            ${item.color ? "Màu: " + item.color : ""} 
            ${item.size ? "Size: " + item.size : ""}
          </small>
          <div>${item.quantity} x ${item.price.toLocaleString()} đ</div>
        </div>
      </div>`
      )
      .join("");

    document.getElementById("checkout-total").textContent =
      total.toLocaleString();
    new bootstrap.Modal(document.getElementById("checkoutModal")).show();
  }

  const checkoutBtn = document.getElementById("checkout-btn");

  // Kiểm tra nếu sự kiện thanh toán
  document
    .getElementById("checkout-btn")
    .addEventListener("click", function () {
      if (cartItems.length === 0) {
        // Thay thế alert bằng hiển thị modal
        const emptyCartModal = new bootstrap.Modal(
          document.getElementById("emptyCartModal")
        );
        emptyCartModal.show();
        // Tự động đóng sau 2 giây
        setTimeout(() => {
          emptyCartModal.hide();
        }, 2000);
        return;
      }

      // Hiển thị thông tin sản phẩm
      const itemsContainer = document.getElementById("checkout-items");
      itemsContainer.innerHTML = cartItems
        .map(
          (item) => `
        <div class="d-flex mb-2">
            <img src="${item.image}" class="me-2" width="50" height="50">
            <div>
                <div>${item.name}</div>
                <small class="text-muted">${
                  item.color ? "Màu: " + item.color : ""
                } ${item.size ? "Size: " + item.size : ""}</small>
                <div>${item.quantity} x ${item.price.toLocaleString()} đ</div>
            </div>
        </div>
    `
        )
        .join("");

      // Cập nhật tổng tiền
      document.getElementById("checkout-total").textContent =
        totalAmount.toLocaleString();

      // Hiển thị modal
      new bootstrap.Modal(document.getElementById("checkoutModal")).show();
    });

  // Xử lý thanh toán
  document
    .getElementById("paymentForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;

      // Lấy các trường input
      const fullnameInput = document.getElementById("checkoutFullname");
      const addressInput = document.getElementById("checkoutAddress");
      const phoneInput = document.getElementById("checkoutPhone");
      const paymentInput = document.getElementById("checkoutPayment");

      // Regex validation
      const nameRegex = /^[a-zA-ZÀ-ỹ\s]{3,}$/;
      const addressRegex = /^[a-zA-Z0-9À-ỹ\s\/.,-]{5,}$/;
      const phoneRegex = /^0\d{9}$/;

      // Clear errors
      clearError(fullnameInput);
      clearError(addressInput);
      clearError(phoneInput);
      clearError(paymentInput);

      // Validate từng trường
      if (
        !validateInput(
          fullnameInput,
          nameRegex,
          "Vui lòng nhập họ tên hợp lệ (tối thiểu 3 ký tự)"
        )
      ) {
        isValid = false;
      }

      if (
        !validateInput(
          addressInput,
          addressRegex,
          "Địa chỉ không hợp lệ (tối thiểu 5 ký tự)"
        )
      ) {
        isValid = false;
      }

      if (
        !validateInput(
          phoneInput,
          phoneRegex,
          "Số điện thoại phải có 10 số và bắt đầu bằng 0"
        )
      ) {
        isValid = false;
      }

      if (paymentInput.value === "") {
        showError(paymentInput, "Vui lòng chọn phương thức thanh toán");
        isValid = false;
      }

      if (!isValid) return;

      // Xử lý dữ liệu theo loại thanh toán
      if (isQuickBuy) {
        console.log("Xử lý mua ngay:", quickBuyItems);
        // Gửi dữ liệu mua ngay đến API hoặc xử lý tại đây
        quickBuyItems = [];
      } else {
        console.log("Xử lý giỏ hàng:", cartItems);
        // Gửi dữ liệu giỏ hàng đến API hoặc xử lý tại đây
        cartItems = [];
        totalAmount = 0;
        updateCart();
      }

      // Hiển thị thông báo và reset
      const successModal = new bootstrap.Modal(
        document.getElementById("successModal")
      );
      successModal.show();
      this.reset();
      isQuickBuy = false;

      // Đóng modal
      bootstrap.Modal.getInstance(
        document.getElementById("checkoutModal")
      ).hide();
      setTimeout(() => successModal.hide(), 3000);
    });

  // Thêm sự kiện input cho các trường
  document
    .querySelectorAll("#paymentForm input, #paymentForm select")
    .forEach((input) => {
      input.addEventListener("input", () => {
        clearError(input);
        if (input.id === "checkoutPhone") {
          input.value = input.value.replace(/\D/g, ""); // Chỉ cho phép nhập số
        }
      });
    });

  // Xử lý khi click vào ảnh sản phẩm để mở modal
  document.querySelectorAll(".product-image").forEach((img) => {
    img.addEventListener("click", function () {
      let name = this.getAttribute("data-name");
      let price = this.getAttribute("data-price");
      let image = this.getAttribute("src");
      let description = this.getAttribute("data-description");
      let category = this.getAttribute("data-category"); // Lấy danh mục sản phẩm
      let images = JSON.parse(this.getAttribute("data-images") || "{}");

      // Nội dung cơ bản của modal
      let modalContent = `
            <div class="row">
                <div class="col-md-5">
                    <img src="${image}" class="img-fluid" alt="${name}">
                </div>
                <div class="col-md-7">
                    <h4 id="modalProductName">${name}</h4>
                    <p><strong>Giá:</strong> <span id="modalProductPrice">${parseInt(
                      price
                    ).toLocaleString()}</span> đ</p>
                    <p>${description}</p>`;

      // Chỉ hiển thị tùy chọn màu sắc và size nếu là giày hoặc dép
      if (
        category === "giay_nam" ||
        category === "dep_nam" ||
        category === "giay_nu" ||
        category === "dep_nu"
      ) {
        modalContent += `
                    <div class="mb-3">
                        <label class="fw-bold">Chọn màu:</label>
                        <div id="colorOptions" class="d-flex gap-2">
                            <button class="color-option" data-color="Đen" style="background-color: black;"></button>
                            <button class="color-option" data-color="Trắng" style="background-color: white; border: 1px solid black;"></button>
                            <button class="color-option" data-color="Xám" style="background-color: gray;"></button>
                            <button class="color-option" data-color="Đỏ" style="background-color: brown;"></button>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="fw-bold">Chọn size:</label>
                        <div id="sizeOptions" class="d-flex gap-2">
                            <button class="size-option btn btn-outline-primary" data-size="39">39</button>
                            <button class="size-option btn btn-outline-primary" data-size="40">40</button>
                            <button class="size-option btn btn-outline-primary" data-size="41">41</button>
                            <button class="size-option btn btn-outline-primary" data-size="42">42</button>
                            <button class="size-option btn btn-outline-primary" data-size="43">43</button>
                        </div>
                    </div>`;
      }

      // Phần số lượng và nút thêm vào giỏ/mua ngay
      modalContent += `
      </div>
      </div>
      <div class="modal-footer d-flex justify-content-end align-items-center">
          <label class="fw-bold me-2">Số lượng:</label>
          <input type="number" id="quantity" class="form-control me-5" value="1" min="1" style="width: 60px;">
          <button type="button" class="btn btn-primary add-to-cart-modal">Thêm vào giỏ</button>
          <button type="button" class="btn btn-success buy-now">Mua ngay</button>
      </div>`;

      // Gán nội dung vào modal
      document.getElementById("productModalBody").innerHTML = modalContent;

      let modalElement = document.getElementById("productModal");

      // Cập nhật hình ảnh khi người dùng chọn màu
      document.querySelectorAll(".color-option").forEach((colorButton) => {
        colorButton.addEventListener("click", function () {
          let color = this.getAttribute("data-color");
          let productImage = document.querySelector("#productModalBody img");
          if (images[color]) {
            productImage.src = images[color];
          }
        });
      });

      // Kiểm tra xem modal đã được khởi tạo trước đó chưa
      if (!modalElement.modalInstance) {
        modalElement.modalInstance = new bootstrap.Modal(modalElement);
      }

      // Hiển thị modal
      modalElement.modalInstance.show();
    });
  });

  // Xử lý các sự kiện click liên quan đến modal
  // Hàm lấy giá trị đã chọn hoặc trả về null nếu không có tùy chọn đó
  const getSelectedOption = (selector) => {
    const option = document.querySelector(`${selector}.active`);
    return option ? option.dataset.color || option.dataset.size : null;
  };

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (target.matches(".buy-now, .add-to-cart-modal")) {
      event.stopImmediatePropagation();

      const productName = document.getElementById("modalProductName").innerText;
      const price = parseInt(
        document
          .getElementById("modalProductPrice")
          .innerText.replace(/\D/g, "")
      );
      const quantity = parseInt(document.getElementById("quantity").value);
      const image = document.querySelector("#productModalBody img").src;

      // Kiểm tra xem sản phẩm có tùy chọn màu/size không
      const hasColorOption = document.querySelector(".color-option") !== null;
      const hasSizeOption = document.querySelector(".size-option") !== null;

      const color = hasColorOption ? getSelectedOption(".color-option") : "";
      const size = hasSizeOption ? getSelectedOption(".size-option") : "";

      // Nếu có tùy chọn nhưng chưa chọn thì cảnh báo
      if ((hasColorOption && !color) || (hasSizeOption && !size)) {
        // Hiển thị modal cảnh báo
        const errorModal = new bootstrap.Modal(
          document.getElementById("errorModal")
        );
        errorModal.show();

        // Tự động ẩn sau 2.5 giây
        setTimeout(() => {
          errorModal.hide();
        }, 2500);
        return;
      }

      // Xây dựng mô tả sản phẩm
      let productDetails = `🛒 Đặt hàng thành công!\n\nBạn đã đặt ${quantity} sản phẩm:\n"${productName}"`;
      let attributes = [];

      if (color) attributes.push(`Màu: ${color}`);
      if (size) attributes.push(`Size: ${size}`);

      if (attributes.length > 0) {
        productDetails += `\n${attributes.join(" - ")}`;
      }

      productDetails += `\nGiá: ${price.toLocaleString()} đ`;

      if (target.classList.contains("buy-now")) {
        // Xử lý mua ngay
        quickBuyItems = [
          {
            name: productName,
            price,
            color: color || null,
            size: size || null,
            quantity,
            image,
          },
        ];

        isQuickBuy = true;
        showCheckoutModal(quickBuyItems);
        bootstrap.Modal.getInstance(
          document.getElementById("productModal")
        ).hide();
      } else {
        // Thêm vào giỏ hàng
        cartItems.push({
          name: productName,
          price,
          color,
          size,
          quantity,
          image,
        });
        totalAmount += price * quantity;
        updateCart();

        // Ẩn modal sản phẩm
        const productModal = bootstrap.Modal.getInstance(
          document.getElementById("productModal")
        );
        if (productModal) productModal.hide();

        // Hiển thị modal thanh toán
        const cartNotification = new bootstrap.Modal(
          document.getElementById("cartNotification")
        );
        cartNotification.show();

        // Tự động ẩn sau 2 giây
        setTimeout(() => {
          cartNotification.hide();
        }, 2000);

        cart.style.display = "block";
      }
    }

    if (target.matches(".color-option, .size-option")) {
      document
        .querySelectorAll(
          target.matches(".color-option") ? ".color-option" : ".size-option"
        )
        .forEach((b) => b.classList.remove("active"));
      target.classList.add("active");
    }
  });
});
