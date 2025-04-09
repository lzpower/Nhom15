document.addEventListener("DOMContentLoaded", function () {
  // 1. CÁC HÀM HỖ TRỢ VALIDATION
  function showError(input, message) {
    let small = input.nextElementSibling;
    if (!small || small.tagName !== "SMALL") {
      small = document.createElement("small");
      input.parentNode.appendChild(small); // Thêm thẻ <small> vào sau input nếu chưa có
    }
    small.textContent = message;
    small.classList.add("text-danger"); // Thêm class Bootstrap để hiển thị lỗi màu đỏ
    input.classList.add("is-invalid"); // Thêm class Bootstrap để đánh dấu input không hợp lệ
  }

  function clearError(input) {
    let small = input.nextElementSibling;
    if (small && small.tagName === "SMALL") {
      small.textContent = ""; // Xóa thông báo lỗi
    }
    input.classList.remove("is-invalid"); // Xóa trạng thái không hợp lệ khỏi input
  }

  function validateInput(input, regex, errorMessage) {
    // Hàm kiểm tra giá trị input dựa trên biểu thức chính quy (regex)
    if (!regex.test(input.value.trim())) {
      showError(input, errorMessage);
      return false;
    } else {
      clearError(input);
      return true;
    }
  }

  function validateBirthdate(input) {
    // Kiểm tra ngày sinh có được chọn hay không
    if (!input.value) {
      showError(input, "Vui lòng chọn ngày sinh.");
      return false;
    } else {
      clearError(input);
      return true;
    }
  }

  function validateConfirmPassword(password, confirmPassword) {
    // So sánh mật khẩu và mật khẩu xác nhận
    if (password.value !== confirmPassword.value) {
      showError(confirmPassword, "Mật khẩu nhập lại không khớp.");
      return false;
    } else {
      clearError(confirmPassword);
      return true;
    }
  }

  function formatDate(dateString) {
    // Định dạng lại ngày từ YYYY-MM-DD thành DD-MM-YYYY
    if (!dateString) return "";
    let parts = dateString.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  // 2. XỬ LÝ FORM ĐĂNG NHẬP
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const username = document.getElementById("login-username");
    const password = document.getElementById("login-password");

    // Kiểm tra ngay khi người dùng nhập dữ liệu (real-time validation)
    username.addEventListener("input", () => {
      validateInput(
        username,
        /^[a-zA-Z][a-zA-Z0-9_.]{4,19}$/, // Bắt đầu bằng chữ cái, dài 5-20 ký tự, cho phép chữ, số, _, .
        "Tên đăng nhập phải bắt đầu bằng chữ cái, dài 5-20 ký tự."
      );
    });

    password.addEventListener("input", () => {
      validateInput(
        password,
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // Mật khẩu: ít nhất 8 ký tự, có chữ hoa, thường, số và ký tự đặc biệt
        "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
    });

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Ngăn form gửi dữ liệu mặc định
      let isValid = true;

      // Kiểm tra tất cả trường khi submit
      isValid &= validateInput(
        username,
        /^[a-zA-Z][a-zA-Z0-9_.]{4,19}$/,
        "Tên đăng nhập phải bắt đầu bằng chữ cái, dài 5-20 ký tự."
      );
      isValid &= validateInput(
        password,
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );

      if (!isValid) return; // Dừng nếu có lỗi

      let users = JSON.parse(localStorage.getItem("users")) || []; // Lấy danh sách người dùng từ localStorage
      const user = users.find(
        (u) => u.username === username.value.trim() && u.password === password.value
      );

      if (user) {
        alert("Đăng nhập thành công! Chuyển hướng đến trang chủ...");
        setTimeout(() => {
          window.location.href = "../index.html"; // Chuyển hướng sau 2 giây
        }, 2000);
      } else {
        showError(username, "Tên đăng nhập hoặc mật khẩu không đúng.");
        showError(password, "Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    });
  }

  // 3. XỬ LÝ FORM ĐĂNG KÝ
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    const inputs = {
      fullname: document.getElementById("register-fullname"),
      birthdate: document.getElementById("register-birthdate"),
      email: document.getElementById("register-email"),
      phone: document.getElementById("register-phone"),
      username: document.getElementById("register-username"),
      password: document.getElementById("register-password"),
      confirmPassword: document.getElementById("register-confirm-password")
    };

    // Real-time validation cho từng trường
    inputs.fullname.addEventListener("input", () => {
      validateInput(
        inputs.fullname,
        /^[a-zA-ZÀ-ỹ\s]{3,}$/, // Chỉ chứa chữ cái (bao gồm tiếng Việt), tối thiểu 3 ký tự
        "Họ và tên chỉ chứa chữ cái, tối thiểu 3 ký tự."
      );
    });

    inputs.birthdate.addEventListener("input", () => {
      validateBirthdate(inputs.birthdate);
    });

    inputs.email.addEventListener("input", () => {
      validateInput(
        inputs.email,
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Định dạng email chuẩn
        "Email không hợp lệ!"
      );
    });

    inputs.phone.addEventListener("input", () => {
      validateInput(
        inputs.phone,
        /^0\d{9}$/, // Số điện thoại 10 chữ số, bắt đầu bằng 0
        "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0."
      );
    });

    inputs.username.addEventListener("input", () => {
      validateInput(
        inputs.username,
        /^[a-zA-Z][a-zA-Z0-9_.]{4,19}$/,
        "Tên đăng nhập phải bắt đầu bằng chữ cái, dài 5-20 ký tự."
      );
    });

    inputs.password.addEventListener("input", () => {
      validateInput(
        inputs.password,
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      // Khi thay đổi password, kiểm tra lại confirm password nếu đã nhập
      if (inputs.confirmPassword.value) {
        validateConfirmPassword(inputs.password, inputs.confirmPassword);
      }
    });

    inputs.confirmPassword.addEventListener("input", () => {
      validateConfirmPassword(inputs.password, inputs.confirmPassword);
    });

    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let isValid = true;

      // Kiểm tra tất cả trường khi submit
      isValid &= validateInput(
        inputs.fullname,
        /^[a-zA-ZÀ-ỹ\s]{3,}$/,
        "Họ và tên chỉ chứa chữ cái, tối thiểu 3 ký tự."
      );
      isValid &= validateBirthdate(inputs.birthdate);
      isValid &= validateInput(
        inputs.email,
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email không hợp lệ!"
      );
      isValid &= validateInput(
        inputs.phone,
        /^0\d{9}$/,
        "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0."
      );
      isValid &= validateInput(
        inputs.username,
        /^[a-zA-Z][a-zA-Z0-9_.]{4,19}$/,
        "Tên đăng nhập phải bắt đầu bằng chữ cái, dài 5-20 ký tự."
      );
      isValid &= validateInput(
        inputs.password,
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      isValid &= validateConfirmPassword(inputs.password, inputs.confirmPassword);

      if (!isValid) return;

      const user = {
        fullname: inputs.fullname.value.trim(),
        birthdate: inputs.birthdate.value,
        email: inputs.email.value.trim(),
        phone: inputs.phone.value.trim(),
        username: inputs.username.value.trim(),
        password: inputs.password.value
      };

      let users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some((u) => u.username === user.username)) {
        showError(inputs.username, "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.");
        return;
      }

      users.push(user);
      localStorage.setItem("users", JSON.stringify(users)); // Lưu danh sách người dùng vào localStorage
      alert("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        window.location.href = "dang_nhap.html";
      }, 2000);
    });
  }

  // 4. XỬ LÝ DANH SÁCH NGƯỜI DÙNG
  function renderUserList() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userListElement = document.getElementById("user-list");

    if (!userListElement) {
      console.warn("Phần tử với ID 'user-list' không tồn tại trong DOM.");
      return;
    }

    userListElement.innerHTML = "";

    if (users.length === 0) {
      userListElement.innerHTML = `
              <tr>
                  <td colspan="7" class="text-center">
                      Chưa có người dùng nào đăng ký. <br>
                      <a href="dang_ky.html" class="btn btn-primary mt-2">Đăng ký ngay</a>
                  </td>
              </tr>`;
      return;
    }

    users.forEach((user, index) => {
      userListElement.innerHTML += `
              <tr>
                  <td>${index + 1}</td>
                  <td>${user.fullname}</td>
                  <td>${formatDate(user.birthdate)}</td>
                  <td>${user.email}</td>
                  <td>${user.phone}</td>
                  <td>${user.username}</td>
                  <td><button class="btn btn-danger btn-sm delete-user" data-index="${index}">Xóa</button></td>
              </tr>`;
    });
  }

  if (document.getElementById("user-list")) {
    renderUserList(); // Hiển thị danh sách người dùng khi trang có phần tử "user-list"
  }

  // 5. XỬ LÝ GIỎ HÀNG
  const cartElements = {
    toggle: document.getElementById("cart-toggle"),
    cart: document.getElementById("cart"),
    close: document.getElementById("cart-close"),
    body: document.getElementById("cart-body"),
    total: document.getElementById("cart-total")
  };
  let cartItems = []; // Mảng lưu các sản phẩm trong giỏ hàng
  let totalAmount = 0; // Tổng tiền giỏ hàng

  if (cartElements.toggle) {
    cartElements.toggle.addEventListener("click", () => {
      cartElements.cart.classList.add("show-cart"); // Hiển thị giỏ hàng
    });
  }

  if (cartElements.close) {
    cartElements.close.addEventListener("click", () => {
      cartElements.cart.classList.remove("show-cart");
      cartElements.cart.style.display = "none"; // Ẩn giỏ hàng
    });
  }

  function updateCart() {
    if (!cartElements.body) return;
    cartElements.body.innerHTML = cartItems.length
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
                                      Màu: ${item.color}, Size: ${item.size}, Số lượng: ${item.quantity}
                                  </p>
                                  <p class="mb-0"><strong>${(item.price * item.quantity).toLocaleString()} đ</strong></p>
                              </div>
                          </div>
                          <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Xóa</button>
                      </div>`
        )
        .join("")
      : '<p class="pt-2">Giỏ hàng của bạn trống.</p>';

    if (cartElements.total) {
      cartElements.total.innerText = totalAmount.toLocaleString(); // Cập nhật tổng tiền
    }
    attachRemoveEvents(); // Gắn sự kiện xóa cho các nút "Xóa" trong giỏ hàng
  }

  function attachRemoveEvents() {
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        totalAmount -= cartItems[index].price * cartItems[index].quantity; // Cập nhật tổng tiền
        cartItems.splice(index, 1); // Xóa sản phẩm khỏi giỏ hàng
        updateCart(); // Cập nhật lại giao diện giỏ hàng
      });
    });
  }

  // 6. XỬ LÝ THANH TOÁN
  let isQuickBuy = false; // Biến để phân biệt giữa "Mua ngay" và thanh toán từ giỏ hàng
  let quickBuyItems = []; // Mảng lưu sản phẩm khi "Mua ngay"

  function showCheckoutModal(items) {
    const itemsContainer = document.getElementById("checkout-items");
    if (!itemsContainer) return;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0); // Tính tổng tiền
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
    document.getElementById("checkout-total").textContent = total.toLocaleString();
    new bootstrap.Modal(document.getElementById("checkoutModal")).show(); // Hiển thị modal thanh toán
  }

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      if (cartItems.length === 0) {
        const emptyCartModal = new bootstrap.Modal(document.getElementById("emptyCartModal"));
        emptyCartModal.show();
        setTimeout(() => emptyCartModal.hide(), 2000); // Hiển thị thông báo giỏ hàng trống trong 2 giây
        return;
      }
      showCheckoutModal(cartItems);
    });
  }

  const paymentForm = document.getElementById("paymentForm");
  if (paymentForm) {
    paymentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const inputs = {
        fullname: document.getElementById("checkoutFullname"),
        address: document.getElementById("checkoutAddress"),
        phone: document.getElementById("checkoutPhone"),
        payment: document.getElementById("checkoutPayment")
      };
      let isValid = true;

      isValid &= validateInput(
        inputs.fullname,
        /^[a-zA-ZÀ-ỹ\s]{3,}$/,
        "Vui lòng nhập họ tên hợp lệ (tối thiểu 3 ký tự)"
      );
      isValid &= validateInput(
        inputs.address,
        /^[a-zA-Z0-9À-ỹ\s\/.,-]{5,}$/, // Địa chỉ: chữ, số, ký tự đặc biệt cơ bản, tối thiểu 5 ký tự
        "Địa chỉ không hợp lệ (tối thiểu 5 ký tự)"
      );
      isValid &= validateInput(
        inputs.phone,
        /^0\d{9}$/,
        "Số điện thoại phải có 10 số và bắt đầu bằng 0"
      );
      if (inputs.payment.value === "") {
        showError(inputs.payment, "Vui lòng chọn phương thức thanh toán");
        isValid = false;
      }

      if (!isValid) return;

      if (isQuickBuy) {
        console.log("Xử lý mua ngay:", quickBuyItems);
        quickBuyItems = []; // Xóa danh sách sản phẩm "Mua ngay" sau khi xử lý
      } else {
        console.log("Xử lý giỏ hàng:", cartItems);
        cartItems = []; // Xóa giỏ hàng sau khi thanh toán
        totalAmount = 0;
        updateCart();
      }

      const successModal = new bootstrap.Modal(document.getElementById("successModal"));
      successModal.show();
      this.reset(); // Xóa dữ liệu trong form
      isQuickBuy = false;
      bootstrap.Modal.getInstance(document.getElementById("checkoutModal")).hide();
      setTimeout(() => successModal.hide(), 3000); // Ẩn modal thành công sau 3 giây
    });

    document.querySelectorAll("#paymentForm input, #paymentForm select").forEach((input) => {
      input.addEventListener("input", () => {
        clearError(input);
        if (input.id === "checkoutPhone") {
          input.value = input.value.replace(/\D/g, ""); // Chỉ cho phép nhập số vào trường phone
        }
      });
    });
  }

  // 7. XỬ LÝ MODAL SẢN PHẨM
  document.querySelectorAll(".product-image").forEach((img) => {
    img.addEventListener("click", function () {
      const data = {
        name: this.getAttribute("data-name"),
        price: this.getAttribute("data-price"),
        image: this.getAttribute("src"),
        description: this.getAttribute("data-description"),
        category: this.getAttribute("data-category"),
        images: JSON.parse(this.getAttribute("data-images") || "{}") // Chuyển chuỗi JSON thành object
      };

      let modalContent = `
              <div class="row">
                  <div class="col-md-5">
                      <img src="${data.image}" class="img-fluid" alt="${data.name}">
                  </div>
                  <div class="col-md-7">
                      <h4 id="modalProductName">${data.name}</h4>
                      <p><strong>Giá:</strong> <span id="modalProductPrice">${parseInt(data.price).toLocaleString()}</span> đ</p>
                      <p>${data.description}</p>`;

      if (["giay_nam", "dep_nam", "giay_nu", "dep_nu"].includes(data.category)) {
        // Chỉ hiển thị tùy chọn màu và size cho các danh mục giày dép
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

      modalContent += `
                  </div>
              </div>
              <div class="modal-footer d-flex justify-content-end align-items-center">
                  <label class="fw-bold me-2">Số lượng:</label>
                  <input type="number" id="quantity" class="form-control me-5" value="1" min="1" style="width: 60px;">
                  <button type="button" class="btn btn-primary add-to-cart-modal">Thêm vào giỏ</button>
                  <button type="button" class="btn btn-success buy-now">Mua ngay</button>
              </div>`;

      document.getElementById("productModalBody").innerHTML = modalContent;
      let modalElement = document.getElementById("productModal");
      if (!modalElement.modalInstance) {
        modalElement.modalInstance = new bootstrap.Modal(modalElement); // Khởi tạo modal nếu chưa có
      }
      modalElement.modalInstance.show();

      document.querySelectorAll(".color-option").forEach((colorButton) => {
        colorButton.addEventListener("click", function () {
          let color = this.getAttribute("data-color");
          let productImage = document.querySelector("#productModalBody img");
          if (data.images[color]) {
            productImage.src = data.images[color]; // Cập nhật ảnh sản phẩm theo màu chọn
          }
        });
      });
    });
  });

  // 8. XỬ LÝ SỰ KIỆN CLICK
  const getSelectedOption = (selector) => {
    // Lấy giá trị của tùy chọn (màu hoặc size) đang được chọn
    const option = document.querySelector(`${selector}.active`);
    return option ? option.dataset.color || option.dataset.size : null;
  };

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (target.matches(".buy-now, .add-to-cart-modal")) {
      event.stopImmediatePropagation(); // Ngăn các sự kiện click khác can thiệp
      const product = {
        name: document.getElementById("modalProductName").innerText,
        price: parseInt(document.getElementById("modalProductPrice").innerText.replace(/\D/g, "")),
        quantity: parseInt(document.getElementById("quantity").value),
        image: document.querySelector("#productModalBody img").src,
        color: getSelectedOption(".color-option") || "",
        size: getSelectedOption(".size-option") || ""
      };

      const hasColorOption = document.querySelector(".color-option") !== null;
      const hasSizeOption = document.querySelector(".size-option") !== null;

      // Kiểm tra xem người dùng đã chọn màu và size chưa (nếu có tùy chọn)
      if ((hasColorOption && !product.color) || (hasSizeOption && !product.size)) {
        const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
        errorModal.show();
        setTimeout(() => errorModal.hide(), 2500);
        return;
      }

      if (target.classList.contains("buy-now")) {
        quickBuyItems = [product];
        isQuickBuy = true;
        showCheckoutModal(quickBuyItems);
        bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
      } else {
        cartItems.push(product);
        totalAmount += product.price * product.quantity;
        updateCart();
        const productModal = bootstrap.Modal.getInstance(document.getElementById("productModal"));
        if (productModal) productModal.hide();
        const cartNotification = new bootstrap.Modal(document.getElementById("cartNotification"));
        cartNotification.show();
        setTimeout(() => cartNotification.hide(), 2000); // Thông báo thêm vào giỏ hàng trong 2 giây
        cartElements.cart.style.display = "block";
      }
    }

    if (target.matches(".color-option, .size-option")) {
      // Xử lý chọn màu hoặc size: chỉ cho phép chọn 1 tùy chọn tại 1 thời điểm
      document
        .querySelectorAll(target.matches(".color-option") ? ".color-option" : ".size-option")
        .forEach((b) => b.classList.remove("active"));
      target.classList.add("active");
    }

    if (target.classList.contains("delete-user")) {
      const index = target.getAttribute("data-index");
      if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.splice(index, 1); // Xóa người dùng khỏi danh sách
        localStorage.setItem("users", JSON.stringify(users));
        renderUserList();
        alert("Xóa người dùng thành công!");
      }
    }
  });

  // 9. KHỞI TẠO CAROUSEL
  let carouselElement = document.querySelector("#carouselId");
  if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
      interval: 3000, // Chuyển slide sau 3 giây
      pause: "hover", // Tạm dừng khi hover chuột
      wrap: true // Quay lại slide đầu khi đến cuối
    });
  }
});