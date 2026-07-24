Shop System — Automated Testing Project
==================================================================================================================================

Playwright (JavaScript) + Docker + GitHub Actions CI

Shop System — An educational online store featuring user registration, authentication, and a shopping cart, 
along with an API for managing products and orders.

PROJECT REPOSITORY
Clone the project here https://github.com/Gygamyt/site_4_interns

NOTE:
Use Docker for installation

==================================================================================================================================
TECHNOLOGIES

* Playwright (JavaScript)
* Node.js 20
* Docker
* GitHub Actions CI

==================================================================================================================================
TEST CASES

Test Cases for 3 modules (Login form, Registration form, Cart page) 
and API tests:
https://docs.google.com/spreadsheets/d/1Rul-UWElw_mhQF3K9h7WyIHlM9v7r4BIQZGY8zLCYBw/edit?usp=sharing

NOTE: 
Failed tests are marked ❌

----------------------------------------------------------------------------------------------------------------------------------
LOGIN module

1	The User is able to Log in
2	The link "Войти" is clickable
3	The User trying to log in without entering email and password
4	The User is trying to log in with invalid formatted email (true password)
5	The User is trying to log in with invalid password (true login)
6	The User is trying to log in with an email that wasn't registered in the system (unregistered email)
7	User is trying to enter spaces in fields

----------------------------------------------------------------------------------------------------------------------------------
REGISTRATION module

1	The link "Зарегистрироваться" is clickable
2	The User is able to Register
3	The User is trying to register with empty fields
4	The User is trying to enter an invalid formatted email
5	The User is trying to enter short password (registration) ❌
6	The User trying to enter registered username ❌
7	The User is trying to enter registered Email (registration module)
8	The User is trying to enter an invalid formatted Phone number
9	The User trying to enter spaces in fields ❌

----------------------------------------------------------------------------------------------------------------------------------
CART module

1	The Cart page is displayed
2	The User is able to put an item to the cart
3	The User is able to put 2 same items to the cart (Samsung S23 Ultra) ❌
4	The User is able to remove an item from the Сart
5	The [Оформить заказ] button is clickable
6	Total price is calculated correctly
7	The User is not able to click the [Оформить заказ] button with an empty cart
8	Item image is displayed in the Cart ❌
9	The Cart is saved after re-login

----------------------------------------------------------------------------------------------------------------------------------
API tests

1	Successful login with valid credentials (The User is able to Log in) (POST)
2	Login with invalid credentials (The User is NOT able to Log in) (POST)
3	Successful registration with valid data (The User is able to Register) (POST)
4	Registration fails when email or username already exists (Conflict 409 POST)
5	The User is able to update profile details (PATCH)
6	The User is not able to update profile details. Update fails when username already exists (409 Conflict - PATCH)
7	The system returns a complete list of products when requesting /product (GET)
8	Successful product deletion (last product DELETE)
9	Successful addition of a product to user’s bucket (POST)
10	Successful retrieval of all user's orders (GET)

==================================================================================================================================
TEST RUN (IDE)

For UI tests:
npx playwright test --grep '@ui'

For API tests:
npx playwright test --grep '@api'
