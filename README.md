
```
ardeo-shop
├─ client
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ logo.svg
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.vue
│  │  ├─ assets
│  │  │  ├─ Ardeo_Video.mp4
│  │  │  ├─ carousel_img1.png
│  │  │  ├─ carousel_img2.png
│  │  │  ├─ carousel_img3.png
│  │  │  ├─ mainproduct
│  │  │  │  ├─ img10.png
│  │  │  │  ├─ img4.png
│  │  │  │  ├─ img5.png
│  │  │  │  ├─ img6.png
│  │  │  │  ├─ img7.png
│  │  │  │  ├─ img8.png
│  │  │  │  ├─ img9.png
│  │  │  │  ├─ m_img7.png
│  │  │  │  ├─ uni_img1.png
│  │  │  │  ├─ uni_img2.png
│  │  │  │  ├─ uni_img3.png
│  │  │  │  ├─ uni_img4.png
│  │  │  │  ├─ wm_img5.png
│  │  │  │  └─ wm_img6.png
│  │  │  ├─ m_detail7.jpg
│  │  │  ├─ uni_detail1.jpg
│  │  │  ├─ uni_detail2.jpg
│  │  │  ├─ uni_detail3.jpg
│  │  │  ├─ uni_detail4.jpg
│  │  │  ├─ vue.svg
│  │  │  ├─ wm_detail5.jpg
│  │  │  └─ wm_detail6.jpg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ BoardList.vue
│  │  │  │  ├─ BoardWrite.vue
│  │  │  │  ├─ OrderManagement.vue
│  │  │  │  ├─ ProductEditModal.vue
│  │  │  │  ├─ Products.vue
│  │  │  │  ├─ ProductTable.vue
│  │  │  │  └─ ReviewList.vue
│  │  │  ├─ auth
│  │  │  │  ├─ FindId.vue
│  │  │  │  ├─ LoginForm.vue
│  │  │  │  ├─ ProfileView.vue
│  │  │  │  ├─ RegisterForm.vue
│  │  │  │  └─ ResetPassword.vue
│  │  │  ├─ board
│  │  │  │  ├─ BoardDetail.vue
│  │  │  │  └─ BoardPage.vue
│  │  │  ├─ cart
│  │  │  │  ├─ CartView.vue
│  │  │  │  ├─ OrderForm.vue
│  │  │  │  └─ OrderSuccess.vue
│  │  │  ├─ mypage
│  │  │  │  ├─ MyOrders.vue
│  │  │  │  ├─ ProfileForm.vue
│  │  │  │  ├─ ReviewForm.vue
│  │  │  │  └─ ShippingAddress.vue
│  │  │  └─ product
│  │  │     └─ ProductDetail.vue
│  │  ├─ env.d.ts
│  │  ├─ main.ts
│  │  ├─ member
│  │  │  ├─ terms.ts
│  │  │  └─ TermsModal.vue
│  │  ├─ router
│  │  │  └─ index.ts
│  │  ├─ style.css
│  │  ├─ utils
│  │  │  ├─ boardApi.ts
│  │  │  └─ userStore.ts
│  │  └─ views
│  │     ├─ About.vue
│  │     ├─ AdminPage.vue
│  │     ├─ category
│  │     │  ├─ AccPage.vue
│  │     │  ├─ BestPage.vue
│  │     │  ├─ MenPage.vue
│  │     │  └─ WomenPage.vue
│  │     ├─ Footer.vue
│  │     ├─ HomePage.vue
│  │     └─ SearchView.vue
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ package-lock.json
├─ package.json
└─ server
   ├─ .env
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ app.js
   │  ├─ config
   │  │  └─ db.js
   │  ├─ controllers
   │  │  ├─ authController.js
   │  │  ├─ boardController.js
   │  │  ├─ cartController.js
   │  │  ├─ orderController.js
   │  │  ├─ productController.js
   │  │  └─ reviewController.js
   │  ├─ middleware
   │  │  ├─ authMiddleware.js
   │  │  └─ multerConfig.js
   │  ├─ models
   │  │  ├─ board.js
   │  │  ├─ cart.js
   │  │  ├─ comment.js
   │  │  ├─ order.js
   │  │  ├─ product
   │  │  │  ├─ inventory.js
   │  │  │  ├─ product.js
   │  │  │  └─ productvariant.js
   │  │  ├─ review.js
   │  │  └─ user.js
   │  └─ routes
   │     ├─ auth.js
   │     ├─ board.js
   │     ├─ cart.js
   │     ├─ order.js
   │     ├─ product.js
   │     └─ review.js
   └─ uploads
      ├─ common_gallery-1769150248413-526032963.png
      ├─ common_gallery-1769150248420-411979994.png
      ├─ common_gallery-1769150248428-637873089.png
      ├─ common_gallery-1769150340952-272413319.png
      ├─ common_gallery-1769150340959-522072992.png
      ├─ common_gallery-1769150340970-670740058.png
      ├─ common_gallery-1769150482013-85137854.png
      ├─ common_gallery-1769150482019-416751366.png
      ├─ common_gallery-1769150482035-554945581.png
      ├─ common_gallery-1769150482042-310796698.png
      ├─ common_gallery-1769150587010-127140265.png
      ├─ common_gallery-1769150587020-33151105.png
      ├─ common_gallery-1769150587027-454793020.png
      ├─ common_gallery-1769150681496-973737317.png
      ├─ common_gallery-1769150681503-877684497.png
      ├─ common_gallery-1769150681521-589851804.png
      ├─ common_gallery-1769150769072-421564909.png
      ├─ common_gallery-1769150769080-329406381.png
      ├─ common_gallery-1769150769086-956354594.png
      ├─ common_gallery-1769150855501-820325736.png
      ├─ common_gallery-1769150855507-7840275.png
      ├─ common_gallery-1769150855515-82325193.png
      ├─ common_thumb-1769150248404-263164366.png
      ├─ common_thumb-1769150340927-428775866.png
      ├─ common_thumb-1769150481986-657087865.png
      ├─ common_thumb-1769150586999-716305669.png
      ├─ common_thumb-1769150681495-162562768.png
      ├─ common_thumb-1769150769072-247893606.png
      ├─ common_thumb-1769150855500-182627029.png
      ├─ images-1769605787534-84386978.png
      ├─ images-1769607894071-20083008.png
      ├─ images-1769608141644-180522948.png
      ├─ images-1769608141662-436433347.png
      └─ images-1769608184797-21008881.png

```