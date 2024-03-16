# Restaurant Management Website
This project is a full-stack website aimed at providing precise seat allocation and real-time food order tracking to facilitate faster queues in restaurants.

## Restaurant
![aaaa](https://github.com/ameyagidh/RestaurantManagementWebsite/assets/65457905/d352593c-e4e7-4250-8b2a-d6cc9fde448b)

### Features

1. **Precise Seat Allocation:** Customers can book seats at the restaurant in advance, ensuring they have a reserved spot upon arrival.

2. **Real-time Food Order Tracking:** Once seated, customers can place their food orders through the website and track their order status in real-time, allowing for efficient kitchen management and faster service.

3. **User Authentication:** Secure user authentication system to ensure only registered users can make bookings and place orders.

4. **Admin Dashboard:** An admin dashboard is provided for restaurant staff to manage bookings, track orders, and adjust seating arrangements as needed.

5. **Responsive Design:** The website is designed to be responsive, ensuring a seamless experience across devices of all sizes.

### Technologies Used

- **Frontend:**
  - HTML
  - CSS
  - JavaScript
  - React.js

- **Backend:**
  - Node.js
  - Express.js
  - Firebase

- **Authentication:**
  - JSON Web Tokens (JWT)

- **Real-time Updates:**
  - WebSockets (e.g., Socket.io)

### Installation

1. Clone the repository:

```
git clone https://github.com/ameyagidh/RestaurantManagementWebsite.git
```

2. Navigate to the project directory:

```
cd restaurant-booking-fullstack
```

3. Install dependencies:

```
npm install
```

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Define the following variables:
     - `DB_URI`: Firebase connection URI
     - `JWT_SECRET`: Secret key for JWT
     - `PORT`: Port number for the server

5. Start the server:

```
npm start
```

6. Access the website in your browser at `http://localhost:3000`.

### Usage
1. Users can browse available seats, select their desired seating arrangement, and proceed to book their seats.
2. After being seated, users can view the menu, place their food orders, and track the status of their orders in real-time.
3. Admins can access the admin dashboard to manage bookings, track orders, and make adjustments as necessary.

### Future Improvements

- Implement payment integration for online bookings and food orders.
- Enhance real-time updates using more advanced WebSocket techniques.
- Implement additional features such as customer reviews and ratings.
